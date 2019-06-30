const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient

const { mongoDbUri } = require('../shared/vars')
const { databaseName } = require('../shared/config')
const {
  validateUserDetails,
  validateBookingDetails,
  checkBookingForOverlap } = require('../shared/validation')

function getAllBookings () {
  return getDatabase()
    .then(db => db.collection('bookings').find().toArray())
}

function getAnonymousBookings () {
  // TODO: optimise this function - no need to get them all first - just query
  return getAllBookings()
    .then(bookings => bookings.map(booking => removeDetails(booking)))
}

function removeDetails ({ startDate, endDate, confirmed }) {
  // remove all booking properties except startDate, endDate and confirmed
  return { startDate, endDate, confirmed }
}

function getUserBookings (authId) {
  return Promise.all([getAllBookings(), getAdminStatus(authId)])
    .then(([bookings, isAdmin]) => {
      if (isAdmin) return bookings
      return bookings.map(booking => {
        return booking.authId === authId ? booking : removeDetails(booking)
      })
    })
}

function getAdminStatus (authId) {
  return getUserDetails(authId)
    .then(user => user.admin)
}

function addBooking (booking, authId) {
  let validationStatus = validateBookingDetails(booking)
  if (validationStatus !== 'ok') throw new Error(validationStatus)
  return getAllBookings()
    .then(bookings => {
      validationStatus = checkBookingForOverlap(booking, bookings)
      if (validationStatus !== 'ok') throw new Error(validationStatus)
    })
    .then(() => initialiseBooking(booking))
    .then(booking => saveBooking(booking, authId))
}

function initialiseBooking (booking) {
  return {
    ...booking,
    confirmed: false,
    dateAdded: new Date(),
    deleteRequested: false
  }
}

function saveBooking (booking, authId) {
  return getDatabase()
    .then(db => {
      db.collection('bookings').save(booking)
        .then(() => {
          return getUserBookings(authId)
            .then(bookings => ({ booking, bookings }))
        })
    })
}

function getDatabase () {
  return MongoClient.connect(mongoDbUri)
    .then(db => db.db(databaseName))
}

function addUser (user) {
  const validationStatus = validateUserDetails(user)
  if (validationStatus !== 'ok') throw new Error(validationStatus)
  user.dateAdded = new Date()
  user.admin = false
  getDatabase()
    .then(db => db.collection('users').save(user))
    .then(result => result.ops[0])
}

function getUsers () {
  return getDatabase()
    .then(db => db.collection('users').find().toArray())
}

function getUserDetails (authId) {
  return getDatabase()
    .then(db => db.collection('users').find().toArray())
    .then(users => users.find(user => user.authId === authId))
}

function makeUserAdmin (emailAddress) {
  return getDatabase()
    .then(db => db.collection('users').update(
      { emailAddress },
      { $set: { 'admin': true } }
    ))
}

function confirmBooking (objectId, authId) {
  return getDatabase()
    .then(db => {
      db.collection('bookings')
        .update({ id: ObjectId(objectId) }, { $set: { 'confirmed': true } })
        .then(() => getUserBookings(authId))
    })
}

function requestDelete (booking, authId) {
  return getDatabase()
    .then(db => {
      if (booking.confirmed) {
        return db.collection('bookings')
          .update(
            { id: ObjectId(booking._id) },
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
  return getDatabase()
    .then(db => db.collection('bookings').remove({ id: ObjectId(booking._id) }))
    .then(result => getUserBookings(authId)
      .then(bookings => ({ result, bookings }))
    )
}

module.exports = {
  getAnonymousBookings,
  getUserBookings,
  addBooking,
  confirmBooking,
  addUser,
  getUsers,
  getUserDetails,
  deleteBooking,
  makeUserAdmin,
  requestDelete
}
