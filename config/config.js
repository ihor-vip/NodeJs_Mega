module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/initial_db',

  ACCESS_TOKEN_SECRET: 'TOKEN_SEVRET',
  REFRESH_TOKEN_SECRET: 'REFRESH_SEVRET',

  SYSTEM_MAIL: process.env.SYSTEM_MAIL || '',
  SYSTEM_MAIL_PASSWORD: process.env.SYSTEM_MAIL_PASSWORD || '',

  FRONTEND_URL: 'https://google.com'
}
