const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs'); 

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

const pool = mysql.createPool({
  port:     process.env.MYSQLPORT,
  user:     process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  host:     process.env.MYSQLHOST,
});

async function seed() {
  const connection = await pool.getConnection();
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10); 

    await connection.query('INSERT INTO employees (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
      'Admin',
      'admin@example.com',
      hashedPassword, 
      'admin',
    ]);

    console.log('Employees seeded successfully!');

    const hashedPassword2 = await bcrypt.hash('jane123', 10); 
    await connection.query('INSERT INTO employees (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
      'Jane Smith',
      'jane@example.com',
      hashedPassword2, 
      'employee',
    ]);

    console.log('Second employee seeded successfully!');

    await connection.query('INSERT INTO attendance (employee_id, timestamp, photo_path) VALUES (?, ?, ?)', [
      1, 
      new Date(),
      '/uploads/john_doe_photo.jpg',
    ]);

    console.log('Attendance seeded successfully for John Doe!');


    await connection.query('INSERT INTO attendance (employee_id, timestamp, photo_path) VALUES (?, ?, ?)', [
      2, 
      new Date(),
      '/uploads/jane_smith_photo.jpg',
    ]);

    console.log('Attendance seeded successfully for Jane Smith!');
  } catch (err) {
    console.error('Error seeding data:', err.message);
  } finally {
    connection.release();
  }
}

seed();
