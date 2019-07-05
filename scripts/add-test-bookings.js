const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const MongoClient = require('mongodb').MongoClient
const moment = require('moment')

const { mongoDbUri } = require('../shared/vars')
const { getClient, saveUsers, users } = require('./initdb')
const { databaseName, bookingsCollectionName } = require('../shared/config')

const client = new MongoClient(mongoDbUri, { useNewUrlParser: true })

const bookings = [
  { // yesterday
    fullName: 'Test User',
    phoneNumber: '123456789',
    emailAddress: 'testuser@tewharepiringa.nz',
    startDate: getDate(-1, 8),
    endDate: getDate(-1, 18),
    purpose: 'For testing purposes',
    guestCount: 12,
    confirmed: true,
    deleteRequested: false
  }, { // today
    fullName: 'Test User',
    phoneNumber: '123456789',
    emailAddress: 'testuser@tewharepiringa.nz',
    startDate: getDate(0, 8),
    endDate: getDate(0, 18),
    purpose: 'For testing purposes',
    guestCount: 9,
    confirmed: false,
    deleteRequested: false
  }, { // tomorrow
    fullName: 'Test User',
    phoneNumber: '123456789',
    emailAddress: 'testuser@tewharepiringa.nz',
    startDate: getDate(1, 8),
    endDate: getDate(1, 18),
    purpose: 'For testing purposes',
    guestCount: 28,
    confirmed: true,
    deleteRequested: false
  }
]

function getDate (todayOffset, hour) {
  return moment().add(todayOffset, 'days').hour(hour).valueOf()
}

saveBookings()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(bookings.length, 'bookings have been added to the database')
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error('Error: no booking were added to the database:', err.message)
    client.close()
  })
  .finally(() => client.close())

function saveBookings () {
  return getDatabase()
    .then(db => db.collection(bookingsCollectionName).insertMany(bookings))
}

function getDatabase () {
  return client.connect()
    .then(conn => conn.db(databaseName))
}
