module.exports = {
  nodeEnv: process.env.NODE_ENV,
  mongoDbUrl: process.env.MONGODB_URI,
  prodMongoDbUrl: process.env.PROD_MONGODB_URI,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  adminUserEmail: process.env.ADMIN_USER_EMAIL,
  adminUserPassword: process.env.ADMIN_USER_PASSWORD,
  testUserEmail: process.env.TEST_USER_EMAIL,
  testUserPassword: process.env.TEST_USER_PASSWORD
}
