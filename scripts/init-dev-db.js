const { getClient, saveUsers, users } = require('./initdb')
const { databaseName } = require('../shared/config')
const { mongoDbUri } = require('../shared/vars')

const client = getClient(mongoDbUri)

client.connect()
  .then(conn => conn.db(databaseName))
  .then(db => saveUsers(db, users))
  .finally(() => client.close())
