const ObjectId = require('mongodb').ObjectID

const {
  validateBookingDetails,
  checkBookingForOverlap } = require('../../shared/validation')
const { databaseName } = require('../../shared/config')
const { mongoDbUrl } = require('../../shared/vars')
const { getDatabase } = require('../../shared/db')

function getDb () {
  return getDatabase(mongoDbUrl, databaseName)
}

function getBookingsCollection () {
  return getDb()
    .then(db => db.collection('bookings'))
}

function getBookingById (id) {
  return getBookingsCollection()
    .then(bookings => bookings.findOne({ _id: ObjectId(id) }))
}

function getAllBookings () {
  // TODO: filter out bookings older than a month
  return getDb()
    .then(db => db.collection('bookings').find().toArray())
}

function getAnonymousBookings () {
  // TODO: optimise this function
  // no need to get them all first
  // just use a projection/predicate
  return getAllBookings()
    .then(bookings => bookings.map(booking => removeDetails(booking)))
}

function removeDetails ({ startDate, endDate, confirmed }) {
  // remove all booking properties except startDate, endDate and confirmed
  return { startDate, endDate, confirmed }
}

function getUserBookings (requesterUsername) {
  return getBookingsCollection()
    .then(bookings => bookings.find({ requesterUsername }).toArray())
}

function addBooking (booking, username) {
  let validationStatus = validateBookingDetails(booking)
  if (validationStatus !== 'ok') throw new Error(validationStatus)

  booking.requesterUsername = username

  return getAllBookings()
    .then(bookings => {
      validationStatus = checkBookingForOverlap(booking, bookings)
      if (validationStatus !== 'ok') throw new Error(validationStatus)
    })
    .then(() => initialiseBooking(booking))
    .then(booking => saveBooking(booking, username))
}

function initialiseBooking (booking) {
  return {
    ...booking,
    confirmed: false,
    dateAdded: new Date(),
    deleteRequested: false
  }
}

function saveBooking (booking, username) {
  return getBookingsCollection()
    .then(bookings => bookings.insertOne(booking)
      .then(() => getUserBookings(username)
        .then(bookings => ({ booking, bookings }))
      )
    )
}

function confirmBooking (objectId) {
  return getBookingsCollection()
    .then(bookings => bookings.updateOne(
      { _id: ObjectId(objectId) },
      { $set: { confirmed: true } }))
    .then(() => getAllBookings())
}

function requestDelete (bookingId, username) {
  return getBookingById(bookingId)
    .then(booking => getBookingsCollection()
      .then(bookings => booking.confirmed
        ? bookings.updateOne( // because it's confirmed, request a delete
          { _id: ObjectId(bookingId) },
          { $set: { 'deleteRequested': true } }
        )
        : bookings.deleteOne( // since it isn't confirmed, just delete it
          { _id: ObjectId(bookingId) }
        )
      )
    )
    .then(() => getUserBookings(username))
}

function deleteBooking (bookingId, username) {
  return getBookingsCollection()
    .then(bookings => bookings.deleteOne({ _id: ObjectId(bookingId) }))
    // or?
    // bookings.updateOne(
    //   { _id: ObjectId(booking._id) },
    //   { $set: { 'deleted': true } }
    // )
    .then(() => getUserBookings(username))
}

module.exports = {
  getAnonymousBookings,
  getUserBookings,
  getAllBookings,
  addBooking,
  confirmBooking,
  deleteBooking,
  requestDelete
}
