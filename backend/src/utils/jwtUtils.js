const jwt = require('jsonwebtoken');
const config = require('../config'); 

function generateToken(payload) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '8h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (err) {
        throw new Error('Invalid token');
    }
}

module.exports = { generateToken, verifyToken };
