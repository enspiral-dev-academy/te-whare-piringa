const { getClient, saveUsers, users } = require('../shared/db')
const { databaseName } = require('../shared/config')
const { prodMongoDbUri } = require('../shared/vars')

const client = getClient(prodMongoDbUri, databaseName)

client.connect()
  .then(conn => conn.db())
  .then(db => saveUsers(db, users))
  .finally(() => client.close())
