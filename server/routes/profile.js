const express = require('express')
const { getTokenDecoder } = require('authenticare/server')

const { getUserDetails } = require('../db/users')
const { getUserPastBookings } = require('../db/bookings')

const router = express.Router()
router.use(express.json())
module.exports = router

function sendError (res) {
  return err => res.status(500).json({ error: err.message })
}

// GET /api/v1/profile
router.get('/', getTokenDecoder(), (req, res) => {
  getUserDetails(req.user.username)
    .then(details => {
      return getUserPastBookings(details.username)
        .then(pastBookings => res.json({ details, pastBookings }))
    })
    .catch(sendError(res))
})
