const express = require('express')
const bodyParser = require('body-parser')
const jsonwt = require('jsonwebtoken')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

const db = require('./db')
const { authClientId } = require('../shared/vars')
const { authDomain } = require('../shared/config')
const {
  sendBookingRequest,
  sendBookingConfirmation,
  sendDeletionRequest,
  sendDeletionConfirmation
} = require('./email')

const router = express.Router()
router.use(bodyParser.json())
module.exports = router

router.get('/getbookings', (req, res) => {
  db.getAnonymousBookings()
    .then(bookings => res.json({ bookings }))
    .catch(err => res.status(500).json({ error: err }))
})

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the
  // header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authDomain}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: authClientId,
  issuer: `https://${authDomain}/`,
  algorithms: ['RS256']
})

function getUserIdFromToken (req) {
  const token = req.headers.authorization.substr(7)
  const decodedToken = jsonwt.decode(token, { complete: true })
  return decodedToken.payload.sub
}

router.use(checkJwt)

router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ error: 'Invalid or missing authorization token' })
  }
})

function sendError (res) {
  return err => res.status(500).json({ error: err })
}

router.get('/checklogin', (req, res) => {
  const authId = getUserIdFromToken(req)
  db.getUserDetails(authId)
    .then(user => {
      if (!user) {
        return db.getAnonymousBookings()
          .then(bookings => res.json({ user, bookings }))
      }
      return db.getUserBookings(authId)
        .then(bookings => res.json({ user, bookings }))
    })
    .catch(sendError(res))
})

router.post('/user/adduser', (req, res) => {
  const user = req.body
  user.authId = getUserIdFromToken(req)

  db.getUserDetails(user.authId)
    .then(details => {
      // if (details) return res.json({error: 'You are already registered', user: userDetails})
      return db.addUser(user)
        .then(userDetails => res.json({ user: userDetails }))
    })
    .catch(sendError(res))
})

router.get('/user/getbookings', (req, res) => {
  const authId = getUserIdFromToken(req)
  db.getAllBookings()
    .then(bookings => {
      return bookings.map(booking => {
        const { startDate, endDate } = booking
        return booking.authId === authId ? booking : { startDate, endDate }
      })
    })
    .catch(sendError(res))
})

router.get('/admin/getbookings', (req, res) => {
  db.getAllBookings()
    .then(bookings => res.json(bookings))
    .catch(sendError(res))
})

router.post('/user/addbooking', (req, res) => {
  // TODO: call sendBookingRequest in here
  const authId = getUserIdFromToken(req)
  db.addBooking(req.body, authId)
    .then(bookings => res.json(bookings))
    .catch(sendError(res))
})

router.put('/admin/confirm/:id', (req, res) => {
  // TODO: call sendBookingConfirmation in here
  const authId = getUserIdFromToken(req)
  db.confirmBooking(req.params.id, authId)
    .then(bookings => res.json(bookings))
    .catch(sendError(res))
})

router.put('/user/requestdelete', (req, res) => {
  // TODO: call sendDeletionRequest in here
  const authId = getUserIdFromToken(req)
  db.requestDelete(req.body, authId)
    .then(({ result, booking }) => res.json({ result, booking }))
    .catch(sendError(res))
})

router.delete('/admin/delete', (req, res) => {
  // TODO: call sendDeletionConfirmation in here
  const authId = getUserIdFromToken(req)
  db.deleteBooking(req.body, authId)
    .then(({ result, booking }) => res.json({ result, booking }))
    .catch(sendError(res))
})

router.get('/user/profile', (req, res) => {
  db.getUsers(req.params.id)
    .then(users => res.json(users))
    .catch(sendError(res))
})
