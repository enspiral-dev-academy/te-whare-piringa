const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const moment = require('moment')

const { getClient } = require('../shared/db')
const { mongoDbUrl } = require('../shared/vars')
const { databaseName, bookingsCollectionName } = require('../shared/config')

const bookings = [
  { // yesterday
    startDate: getDate(-1, 8),
    endDate: getDate(-1, 18),
    purpose: 'For testing purposes',
    guestCount: 12,
    confirmed: true,
    deleteRequested: false,
    requesterUsername: 'testuser'
  }, { // today
    startDate: getDate(0, 8),
    endDate: getDate(0, 18),
    purpose: 'For testing purposes',
    guestCount: 9,
    confirmed: false,
    deleteRequested: false,
    requesterUsername: 'testuser'
  }, { // tomorrow
    startDate: getDate(1, 8),
    endDate: getDate(1, 18),
    purpose: 'For testing purposes',
    guestCount: 28,
    confirmed: true,
    deleteRequested: false,
    requesterUsername: 'testuser'
  }
]

function getDate (todayOffset, hour) {
  return moment()
    .add(todayOffset, 'days')
    .hour(hour).minute(0).second(0).millisecond(0)
    .toISOString()
}

const client = getClient(mongoDbUrl)

client.connect()
  .then(conn => conn.db(databaseName))
  .then(db => db.collection(bookingsCollectionName).insertMany(bookings))
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
