const { generateHash } = require('authenticare/server')

const { validateUserDetails } = require('../../shared/validation')
const { mongoDbUri, databaseName } = require('../../shared/vars')
const { getDatabase } = require('../../shared/db')

const usersCollectionName = 'users'

module.exports = {
  isAdmin,
  createUser,
  userExists,
  getUsers,
  getUserDetails,
  getUserByName,
  makeUserAdmin
}

function getDb () {
  return getDatabase(mongoDbUri, databaseName)
}

function isAdmin (username) {
  return getUserByName(username)
    .then(user => !!user.isAdmin)
}

function getUserByName (username) {
  return getDb()
    .then(db => db.collection(usersCollectionName).findOne({ username }))
}

function userExists (username) {
  return getDb()
    .then(db => db.collection(usersCollectionName).countDocuments({ username }))
    .then(count => count > 0)
}

function createUser (user) {
  const validationStatus = validateUserDetails(user)
  if (validationStatus !== 'ok') throw new Error(validationStatus)

  return userExists(user.username)
    .then(exists => {
      if (exists) {
        return Promise.reject(new Error('Username is already in use'))
      }
    })
    .then(() => Promise.all([generateHash(user.password), getDb()])
      .then(([passwordHash, db]) => {
        const { username, fullName, phoneNumber, emailAddress } = user
        const newUser = {
          username,
          fullName,
          phoneNumber,
          emailAddress,
          isAdmin: false,
          hash: passwordHash,
          dateAdded: new Date()
        }

        return db.collection(usersCollectionName).insertOne(newUser)
          .then(result => result.ops[0]) // result.ops[0] is the newly added user
      })
    )
}

function getUsers () {
  return getDb()
    .then(db => db.collection(usersCollectionName).find().toArray())
}

function getUserDetails (username) {
  return getDb()
    .then(db => db.collection(usersCollectionName).findOne({ username }))
    .then(({ _id, username, fullName, phoneNumber, emailAddress, isAdmin }) => (
      { _id, username, fullName, phoneNumber, emailAddress, isAdmin }
    ))
}

function makeUserAdmin (emailAddress) {
  return getDb()
    .then(db => db.collection(usersCollectionName).update(
      { emailAddress },
      { $set: { 'admin': true } }
    ))
}
