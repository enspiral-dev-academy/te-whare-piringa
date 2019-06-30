const path = require('path')
const exec = require('child_process').exec

require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const {
  prodMongoDbUri,
  prodDatabaseName,
  adminUserId,
  testUserId } = require('../shared/vars')

const herokuCommand = `heroku run "npm run db:init" --app tewharepiringa \
--env MONGODB_URI=${prodMongoDbUri};\
DATABASE_NAME=${prodDatabaseName};\
ADMIN_USER_ID="${adminUserId}";\
TEST_USER_ID="${testUserId}"`

exec(herokuCommand, (err, buffer) => {
  /* eslint-disable no-console */

  if (err) {
    return console.error('Error:', err)
  }

  console.info(buffer.toString())
  console.info('The remote database has been initialised.')
})
