/* eslint-disable no-console */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const exec = require('child_process').exec

const herokuCommand = `heroku config:set --app tewharepiringa \
DATABASE_NAME=${process.env.PROD_DATABASE_NAME} \
MONGODB_URI=${process.env.PROD_MONGODB_URI} \
MAILGUN_API_KEY=${process.env.MAILGUN_API_KEY} \
ADMIN_USER_ID="${process.env.ADMIN_USER_ID}" \
TEST_USER_ID="${process.env.TEST_USER_ID}" \
CALLBACK_URL=${process.env.PROD_CALLBACK_URL}`

exec(herokuCommand, (err, buffer) => {
  if (err) {
    return console.error('Error:', err)
  }

  console.info(buffer.toString())
  console.info('The environment variables have been deployed to Heroku')
})
