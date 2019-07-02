const { getClient, getDatabase, saveUsers, users } = require('./initdb')
const { prodMongoDbUri, prodDatabaseName } = require('../shared/vars')

const client = getClient(prodMongoDbUri, prodDatabaseName)

getDatabase(client)
  .then(db => saveUsers(db, users))
  .finally(() => client.close())
