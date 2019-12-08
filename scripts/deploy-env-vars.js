/* eslint-disable no-console */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const exec = require('child_process').exec

const herokuCommand = `heroku config:set --app tewharepiringa \
NODE_ENV=production \
MONGODB_URI=${process.env.PROD_MONGODB_URI} \
JWT_SECRET=${process.env.JWT_SECRET} \
MAILGUN_API_KEY=${process.env.MAILGUN_API_KEY} \
ADMIN_USER_EMAIL=${process.env.ADMIN_USER_EMAIL} \
ADMIN_USER_PASSWORD=${process.env.ADMIN_USER_PASSWORD} \
TEST_USER_EMAIL=${process.env.TEST_USER_EMAIL} \
TEST_USER_PASSWORD=${process.env.TEST_USER_PASSWORD}`

exec(herokuCommand, (err, buffer) => {
  if (err) {
    return console.error('Error:', err)
  }

  console.info(buffer.toString())
  console.info('The environment variables have been deployed to Heroku')
})
