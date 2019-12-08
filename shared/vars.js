module.exports = {
  nodeEnv: process.env.NODE_ENV,
  mongoDbUri: process.env.MONGODB_URI,
  prodMongoDbUri: process.env.PROD_MONGODB_URI,
  databaseName: process.env.DATABASE_NAME,
  prodDatabaseName: process.env.PROD_DATABASE_NAME,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  adminUserEmail: process.env.ADMIN_USER_EMAIL,
  adminUserPassword: process.env.ADMIN_USER_PASSWORD,
  testUserEmail: process.env.TEST_USER_EMAIL,
  testUserPassword: process.env.TEST_USER_PASSWORD
}
