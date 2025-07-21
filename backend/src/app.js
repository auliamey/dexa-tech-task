var express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const empRoutes = require('./routes/employees');
const attRoutes = require('./routes/attendance');
const { authenticate } = require('./middleware/auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/employee', authenticate, empRoutes);
app.use('/api/attendance', authenticate, attRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
