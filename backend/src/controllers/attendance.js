const Attendance = require('../models/Attendance');
const path = require('path');
const fs = require('fs')  

async function submit(req, res) {
  try {
    const file = req.files?.photo;
    if (!file) {
      return res.status(400).json({ message: 'Photo is required' });
    }

    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filename   = `${Date.now()}_${file.name}`;
    const uploadPath = path.join(uploadDir, filename);

    await file.mv(uploadPath);

    await Attendance.log({
      employee_id: req.user.id,
      timestamp:   new Date(),
      photo_path:  `/uploads/${filename}`,
    });

    return res.json({ message: 'Attendance recorded' });
  } catch (err) {
    console.error('Attendance submit error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getMyAttendance(req, res) {
    const records = await Attendance.findByEmployee(req.user.id);
    res.json(records);
}

async function getAllAttendance(req, res) {
    const records = await Attendance.findAll();
    res.json(records);
}

module.exports = { submit, getMyAttendance, getAllAttendance };
