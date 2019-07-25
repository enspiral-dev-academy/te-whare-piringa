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
        const response = bookings.map(booking => {
          const { startDate, endDate, requesterUsername } = booking
          const sanitizedBooking = isAdmin || requesterUsername === username
            ? booking
            : { startDate, endDate }
          return sanitizedBooking
        })
        res.json(response)
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
  addBooking(req.body, req.user.username)
    .then(bookings => res.json(bookings))
    // .then(sendBookingRequest)
    .catch(sendError(res))
})

// PUT /api/v1/bookings/confirm/:id
router.put('/confirm/:id', (req, res) => {
  // TODO: ensure user is an admin
  confirmBooking(req.params.id)
    .then(bookings => res.json(bookings))
    // .then(sendBookingConfirmation)
    .catch(sendError(res))
})

// PUT /api/v1/bookings
router.put('/', (req, res) => {
  requestDelete(req.body, req.user.id)
    .then(({ result, booking }) => res.json({ result, booking }))
    // .then(sendDeletionRequest)
    .catch(sendError(res))
})

router.delete('/', (req, res) => {
  // TODO: ensure user is an admin
  deleteBooking(req.body, req.user.id)
    .then(({ result, booking }) => res.json({ result, booking }))
    // .then(sendDeletionConfirmation)
    .catch(sendError(res))
})

function sendError (res) {
  return err => res.status(500).json({ error: err })
}
