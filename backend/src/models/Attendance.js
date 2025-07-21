const pool = require('../db');

async function log({ employee_id, timestamp, photo_path }) {
  const [result] = await pool.query(
    `INSERT INTO attendance
       (employee_id, timestamp, photo_path)
     VALUES (?, ?, ?)`,
    [employee_id, timestamp, photo_path]
  );
  return result.insertId;
}

async function findByEmployee(id) {
    const [rows] = await pool.query('SELECT * FROM attendance WHERE employee_id = ? ORDER BY timestamp DESC', [id]);
    return rows;
}

async function findAll() {
    const [rows] = await pool.query('SELECT * FROM attendance ORDER BY timestamp DESC');
    return rows;
}

module.exports = { log, findByEmployee, findAll };
