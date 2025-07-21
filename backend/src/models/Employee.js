const pool = require('../db');

async function findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE email = ?', [email]);
    return rows[0];
}

async function create({ name, email, password_hash, role }) {
    const [result] = await pool.query(
        'INSERT INTO employees (name, email, password_hash, role) VALUES (?, ?, ?, ?)', 
        [name, email, password_hash, role]
    );
    return { id: result.insertId, name, email, role };
}

async function getAll() {
    const [rows] = await pool.query('SELECT id, name, email, role FROM employees');
    return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, role FROM employees WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function update(id, { name, email, password_hash, role }) {
  const sets = [], params = [];
  if (name != null) {
    sets.push('name = ?'); params.push(name);
  }
  if (email != null) {
    sets.push('email = ?'); params.push(email);
  }
  if (password_hash != null) {
    sets.push('password_hash = ?'); params.push(password_hash);
  }
  if (role != null) {
    sets.push('role = ?'); params.push(role);
  }
  if (sets.length === 0) return findById(id);
  params.push(id);
  const sql = `UPDATE employees SET ${sets.join(', ')} WHERE id = ?`;
  await pool.query(sql, params);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query(
    'DELETE FROM employees WHERE id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = { 
    findByEmail, 
    create, 
    getAll,
    findById,
    update,
    remove
};
