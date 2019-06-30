const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const MongoClient = require('mongodb').MongoClient

const { usersCollectionName } = require('../shared/config')
const {
  mongoDbUri,
  databaseName,
  adminUserId,
  testUserId } = require('../shared/vars')

const client = new MongoClient(mongoDbUri, { useNewUrlParser: true })

const getDatabase = () => {
  return client.connect()
    .then(conn => conn.db(databaseName))
}

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

const saveUsers = () => {
  return getDatabase()
    .then(db => db.collection(usersCollectionName).insertMany(users))
}

saveUsers()
  .then(_ => {
    // eslint-disable-next-line no-console
    console.log(users.length, 'users have been added to the database')
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error('Error: no users were added to the database:', err.message)
    client.close()
  })
  .finally(() => client.close())
