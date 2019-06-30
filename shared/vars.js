module.exports = {
  nodeEnv: process.env.NODE_ENV,
  mongoDbUri: process.env.MONGODB_URI,
  databaseName: process.env.DATABASE_NAME,
  prodDatabaseName: process.env.PROD_DATABASE_NAME,
  prodMongoDbUri: process.env.PROD_MONGODB_URI,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  adminUserId: process.env.ADMIN_USER_ID,
  testUserId: process.env.TEST_USER_ID,
  callbackUrl: process.env.CALLBACK_URL
}
