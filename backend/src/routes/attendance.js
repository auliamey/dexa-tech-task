const express = require('express');
const { submit, getMyAttendance, getAllAttendance } = require('../controllers/attendance');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, getMyAttendance);
router.post('/', authenticate, submit);

router.get('/all', authenticate, authorizeAdmin, getAllAttendance);

module.exports = router;