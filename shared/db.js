const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const MongoClient = require('mongodb').MongoClient
const { generateHash } = require('authenticare/server')

const { usersCollectionName } = require('../shared/config')
const {
  nodeEnv,
  adminUserEmail,
  adminUserPassword,
  testUserEmail,
  testUserPassword
} = require('../shared/vars')

const users = []

Promise.all([
  generateHash(adminUserPassword),
  generateHash(testUserPassword)]
).then(([adminHash, testuserHash]) => {
  users.push({ // admin
    username: adminUserEmail,
    fullName: 'Booking Administrator',
    phoneNumber: '111 222 333',
    emailAddress: adminUserEmail,
    hash: adminHash,
    isAdmin: true
  })
  users.push({ // test user
    username: testUserEmail,
    fullName: 'Test User',
    phoneNumber: '444 555 666',
    emailAddress: testUserEmail,
    hash: testuserHash,
    isAdmin: false
  })
})

module.exports = {
  getClient,
  getDatabase,
  saveUsers,
  users
}

// Used by the application at runtime
function getDatabase (url, databaseName) {
  // For some reason the local development database is behaving
  // differently than the hosted Altas database when it comes to getting
  // a connection to the database. This function encapsulates the difference.

  if (nodeEnv === 'development') {
    return getClient(url).connect().then(conn => conn.db(databaseName))
  }

  if (nodeEnv === 'production') {
    return getClient(url, databaseName).connect().then(conn => conn.db())
  }

  throw new Error('NODE_ENV has unsupported value:', nodeEnv)
}

// Also used directly by the init db scripts
function getClient (url, databaseName) {
  const connectionUrl = databaseName ? `${url}/${databaseName}` : url
  return new MongoClient(
    connectionUrl,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
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
