const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',  
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '', 
  database: process.env.DB_NAME || 'absensi',
});

// railway
// const pool = mysql.createPool(process.env.MYSQL_URL);

pool.getConnection()
  .then(connection => {
    console.log("Connected to MySQL database!");
    connection.release(); 
  })
  .catch(err => {
    console.log(process.env.MYSQL_URL)
    console.error("Error connecting to MySQL:", err.message);
  });


module.exports = pool;
