/* eslint-disable no-console */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const exec = require('child_process').exec

const herokuCommand = `heroku config:set --app tewharepiringa \
NODE_ENV=production \
MONGODB_URI=${process.env.PROD_MONGODB_URI} \
MAILGUN_API_KEY=${process.env.MAILGUN_API_KEY}`

exec(herokuCommand, (err, buffer) => {
  if (err) {
    return console.error('Error:', err)
  }

  console.info(buffer.toString())
  console.info('The environment variables have been deployed to Heroku')
})
