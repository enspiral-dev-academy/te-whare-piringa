const { getClient, saveUsers, users } = require('../shared/db')
const { mongoDbUri, databaseName } = require('../shared/vars')

const client = getClient(mongoDbUri)

client.connect()
  .then(conn => conn.db(databaseName))
  .then(db => saveUsers(db, users))
  .finally(() => client.close())
