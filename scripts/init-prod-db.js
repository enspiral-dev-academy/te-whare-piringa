const { getClient, getDatabase, saveUsers, users } = require('../shared/db')
const { prodMongoDbUri } = require('../shared/vars')
const { databaseName } = require('../shared/config')

const client = getClient(prodMongoDbUri, databaseName)

getDatabase(client)
  .then(db => saveUsers(db, users))
  .finally(() => client.close())
