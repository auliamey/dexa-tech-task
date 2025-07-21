require('dotenv').config();

const config = {
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASS || '',
  dbName: process.env.DB_NAME || 'absensi',
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000
};

module.exports = config;
