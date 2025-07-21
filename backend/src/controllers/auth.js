const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const { generateToken } = require('../utils/jwtUtils'); 

async function register(req, res) {
    const { name, email, password } = req.body;

    const existing = await Employee.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);  

    const user = await Employee.create({ name, email, password_hash: hash, role: 'employee' });
    res.status(201).json({ message: 'User created', user });
}

async function login(req, res) {
    const { email, password } = req.body;

    const user = await Employee.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token });
}

module.exports = { register, login };
