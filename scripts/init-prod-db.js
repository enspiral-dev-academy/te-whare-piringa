const { getClient, saveUsers, users } = require('../shared/db')
const { prodMongoDbUri, prodDatabaseName } = require('../shared/vars')

const client = getClient(prodMongoDbUri, prodDatabaseName)

client.connect()
  .then(conn => conn.db())
  .then(db => saveUsers(db, users))
  .finally(() => client.close())
