const path = require('path')
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const bookingRoutes = require('./routes/bookings')

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1', authRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/bookings', bookingRoutes)

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ error: 'Invalid or missing authorization token' })
  }

  // TODO: Remove this for a better alternative
  res.status(500).send({ error: err.message })
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

module.exports = app
