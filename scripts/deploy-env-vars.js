/* eslint-disable no-console */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const exec = require('child_process').exec

const herokuCommand = `heroku config:set --app tewharepiringa \
MAILGUN_API_KEY=${process.env.MAILGUN_API_KEY} \
AUTH_CLIENT_ID=${process.env.AUTH_CLIENT_ID} \
ADMIN_USER_ID="${process.env.ADMIN_USER_ID}" \
TEST_USER_ID="${process.env.TEST_USER_ID}" \
CALLBACK_URL=http://tewharepiringa.nz/callback`

exec(herokuCommand, (err, buffer) => {
  if (err) {
    return console.error('Error:', err)
  }

  console.info(buffer.toString())
  console.info('The environment variables have been deployed to Heroku')
})
