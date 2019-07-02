const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const MongoClient = require('mongodb').MongoClient

const { usersCollectionName } = require('../shared/config')
const { adminUserId, testUserId } = require('../shared/vars')

const users = [
  { // admin
    'fullName': 'Booking Administrator',
    'phoneNumber': '',
    'emailAddress': 'admin@tewharepiringa.nz',
    'authId': adminUserId,
    'admin': true
  }, { // test user
    'fullName': 'Test User',
    'phoneNumber': '',
    'emailAddress': 'testuser@tewharepiringa.nz',
    'authId': testUserId,
    'admin': false
  }
]

module.exports = {
  getClient,
  getDatabase,
  saveUsers,
  users
}

function getClient (url, databaseName) {
  const connectionUrl = databaseName ? `${url}/${databaseName}` : url
  return new MongoClient(connectionUrl, { useNewUrlParser: true })
}

function getDatabase (client) {
  return client.connect()
    .then(conn => conn.db())
}

function saveUsers (db, users) {
  return db
    .collection(usersCollectionName)
    .insertMany(users)
    .then(showSuccess)
    .catch(showError)
}

function showSuccess ({ insertedCount }) {
  // eslint-disable-next-line no-console
  console.log(insertedCount, 'users have been added to the database')
}

function showError (err) {
  // eslint-disable-next-line no-console
  console.error('Error: no users were added to the database:', err.message)
}
