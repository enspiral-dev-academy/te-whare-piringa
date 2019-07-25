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
  return getDb()
    .then(db => db.collection('bookings').find({ requesterUsername }).toArray())
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
  return getDb()
    .then(db => {
      return db.collection('bookings').insertOne(booking)
        .then(() => getUserBookings(username)
          .then(bookings => ({ booking, bookings }))
        )
    })
}

function confirmBooking (objectId) {
  return getDb()
    .then(db => db.collection('bookings')
      .updateOne({ _id: ObjectId(objectId) }, { $set: { confirmed: true } })
      .then(() => getAllBookings())
    )
}

function requestDelete (booking, authId) {
  return getDb()
    .then(db => {
      if (booking.confirmed) {
        return db.collection('bookings')
          .updateOne(
            { _id: ObjectId(booking._id) },
            { $set: { 'deleteRequested': true } }
          )
          .then(result => getUserBookings(authId)
            .then(bookings => ({ result, bookings, sendEmail: true }))
          )
      } else {
        return deleteBooking(booking, authId)
          .then(result => ({ result, booking }))
      }
    })
}

function deleteBooking (booking, authId) {
  return getDb()
    .then(db => db.collection('bookings').remove({ _id: ObjectId(booking._id) }))
    .then(result => getUserBookings(authId)
      .then(bookings => ({ result, bookings }))
    )
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
