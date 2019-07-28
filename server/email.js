const moment = require('moment')
const mailgun = require('mailgun-js')

const { mailgunApiKey } = require('../shared/vars')
const { newRequestEmail, mailgunDomainName } = require('../shared/config')

function sendBookingRequest (booking, send = sendMail) {
  const sender = booking.emailAddress
  const receiver = newRequestEmail
  const subject = 'Te Whare Piringa: New booking request'

  const start = moment(booking.startDate).format()
  const end = moment(booking.endDate).format()

  const details = {
    to: receiver,
    from: sender,
    subject: subject,
    html: `
    <h1>New booking request from ${booking.fullName}<h1>
    <h2>Booking Details</h2>
    Email: ${booking.emailAddress}<br>
    Phone: ${booking.phoneNumber}<br>
    Start: ${start}<br>
    End: ${end}<br>
    Purpose: ${booking.purpose}<br>
    Number of Guests: ${booking.guestCount}
    <p><a href="https://tewharepiringa.nz/admin">Click here to confirm</a></p>
    `
  }

  send(details)
}

function sendBookingConfirmation (booking, send = sendMail) {
  const sender = newRequestEmail
  const receiver = booking.emailAddress
  const subject = 'Te Whare Piringa: Booking confirmation'

  const start = moment(booking.startDate).format()
  const end = moment(booking.endDate).format()

  const email = {
    to: receiver,
    from: sender,
    subject: subject,
    html: `
    <h1>Your booking request has been confirmed<h1>
    <h2>Booking Details</h2>
    Email: ${booking.emailAddress}<br>
    Phone: ${booking.phoneNumber}<br>
    Start: ${start}<br>
    End: ${end}<br>
    Purpose: ${booking.purpose}<br>
    Number of Guests: ${booking.guestCount}
    `
  }

  send(email)
}

function sendDeletionRequest (booking, send = sendMail) {
  const sender = booking.emailAddress
  const receiver = newRequestEmail
  const subject = 'Te Whare Piringa: Request to delete booking'

  const start = moment(booking.startDate).format()
  const end = moment(booking.endDate).format()

  const email = {
    to: receiver,
    from: sender,
    subject: subject,
    html: `
    <h1>Request to delete booking from ${booking.fullName}<h1>
    <h2>Booking Details</h2>
    Email: ${booking.emailAddress}<br>
    Phone: ${booking.phoneNumber}<br>
    Start: ${start}<br>
    End: ${end}<br>
    Purpose: ${booking.purpose}<br>
    Number of Guests: ${booking.guestCount}
    <p><a href="https://tewharepiringa.nz/admin">Click here to confirm</a></p>
    `
  }

  send(email)
}

function sendDeletionConfirmation (booking, send = sendMail) {
  const sender = newRequestEmail
  const receiver = booking.emailAddress
  const subject = 'Te Whare Piringa: Booking deleted'

  const start = moment(booking.startDate).format()
  const end = moment(booking.endDate).format()

  const email = {
    to: receiver,
    from: sender,
    subject: subject,
    html: `
    <h1>Your booking request has been deleted<h1>
    <h2>Booking Details</h2>
    Email: ${booking.emailAddress}<br>
    Phone: ${booking.phoneNumber}<br>
    Start: ${start}<br>
    End: ${end}<br>
    Purpose: ${booking.purpose}<br>
    Number of Guests: ${booking.guestCount}
    `
  }

  send(email)
}

function sendMail (details) {
  // TODO: only send mail in production ... for now
  if (process.env.NODE_ENV !== 'production') return

  const mg = mailgun({
    apiKey: mailgunApiKey,
    domain: mailgunDomainName
  })

  mg.messages().send(details, (error, body) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  })
}

module.exports = {
  sendBookingRequest,
  sendBookingConfirmation,
  sendDeletionRequest,
  sendDeletionConfirmation
}
