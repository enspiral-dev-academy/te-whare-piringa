const { getClient, saveUsers, users } = require('./initdb')
const { mongoDbUri, databaseName } = require('../shared/vars')

const client = getClient(mongoDbUri)

client.connect()
  .then(conn => conn.db(databaseName))
  .then(db => saveUsers(db, users))
  .finally(() => client.close())
