const moment = require('moment')
const express = require('express')
const { getTokenDecoder } = require('authenticare/server')

const {
  sendBookingRequest,
  sendBookingConfirmation,
  sendDeletionRequest,
  sendDeletionConfirmation
} = require('../email')

const {
  addBooking,
  requestDelete,
  deleteBooking,
  confirmBooking,
  getAllBookings,
  getUserBookings,
  getAnonymousBookings
} = require('../db/bookings')

const { isAdmin } = require('../db/users')

const router = express.Router()
router.use(express.json())
module.exports = router

// GET /api/v1/bookings
router.get('/', getTokenDecoder(false), (req, res) => {
  if (!req.user) { // anonymous user
    return getAnonymousBookings()
      .then(bookings => res.json({ bookings }))
      .catch(err => res.status(500).json({ error: err }))
  }

  const { username } = req.user
  isAdmin(username).then(isAdmin => {
    getAllBookings()
      .then(bookings => {
        const sanitizedBookings = bookings.map(booking => {
          const {
            startDate,
            endDate,
            confirmed,
            dateAdded,
            deleteRequested,
            requesterUsername
          } = booking
          const sanitizedBooking = isAdmin || requesterUsername === username
            ? booking
            : { startDate, endDate, confirmed, dateAdded, deleteRequested }
          return sanitizedBooking
        })
        res.json({ bookings: sanitizedBookings })
      })
      .catch(sendError(res))
  })
})

// Require all routes below this point to receive a token in the request
router.use(getTokenDecoder())

// GET /api/v1/bookings/mine
router.get('/mine', (req, res) => {
  getUserBookings(req.user.username)
    .then(bookings => res.json(bookings))
    .catch(sendError(res))
})

// POST /api/v1/bookings
router.post('/', (req, res) => {
  addBooking(
    {
      ...req.body,
      startDate: moment(req.body.startDate),
      endDate: moment(req.body.endDate),
      dateAdded: moment()
    },
    req.user.username
  )
    .then(bookings => res.json(bookings))
    .then(sendBookingRequest)
    .catch(sendError(res))
})

// PUT /api/v1/bookings/confirm/:id
router.put('/confirm/:id', (req, res) => {
  isAdmin(req.user.username)
    .then(isAdmin => isAdmin
      ? confirmBooking(req.params.id)
        .then(bookings => res.json(bookings))
        .then(sendBookingConfirmation)
        .catch(sendError(res))
      : res.status(404) // only admins can access this route
    )
})

// DELETE /api/v1/bookings
router.delete('/', (req, res) => {
  const { _id: bookingId } = req.body
  const { username } = req.user

  isAdmin(username)
    .then(isAdmin => isAdmin
      ? deleteBooking(bookingId, username) // request is from an admin
        .then(bookings => res.json({ bookings }))
        .then(sendDeletionConfirmation)
        .catch(sendError(res))
      : requestDelete(bookingId, username) // request is from a user
        .then(bookings => res.json({ bookings }))
        .then(sendDeletionRequest)
        .catch(sendError(res))
    )
})

function sendError (res) {
  return err => {
    res.status(500).json({ error: err.message })
  }
}
