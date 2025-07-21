const Employee = require('../models/Employee');
const bcrypt   = require('bcryptjs');    

async function list(req, res) {
    try {
        const employees = await Employee.getAll();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function create(req, res) {
    const { name, email, password, role } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const employee = await Employee.create({ name, email, password_hash: hash, role });
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getProfile(req, res) {
  try {
    const id = req.user.id;
    const profile = await Employee.findById(id);
    if (!profile) return res.status(404).json({ message: 'Not found' });
    res.json(profile);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const id = req.user.id;
    const { name, email, password } = req.body;

    let password_hash;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    const updated = await Employee.update(id, {
      name,
      email,
      password_hash,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateEmployee(req, res) {
  const id = Number(req.params.id);
  const { name, email, role, password } = req.body;
  let password_hash;
  if (password) password_hash = await bcrypt.hash(password, 10);
  const updated = await Employee.update(id, {
    name,
    email,
    role,
    password_hash,
  });
  res.json(updated);
}

async function deleteEmployee(req, res) {
  const id = Number(req.params.id);
  await Employee.remove(id);
  res.sendStatus(204);
}

module.exports = { 
    list, 
    create, 
    getProfile, 
    updateProfile,
    updateEmployee,
    deleteEmployee
};
