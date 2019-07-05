module.exports = {
  nodeEnv: process.env.NODE_ENV,
  mongoDbUri: process.env.MONGODB_URI,
  prodMongoDbUri: process.env.PROD_MONGODB_URI,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  adminUserId: process.env.ADMIN_USER_ID,
  testUserId: process.env.TEST_USER_ID,
  callbackUrl: process.env.CALLBACK_URL
}
