const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const {
  list,
  create,
  getProfile,
  updateProfile,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employees');
const router = express.Router();

router.get('/', authenticate, authorizeAdmin, list);
router.post('/', authenticate, authorizeAdmin, create);

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);

router.put('/:id', authenticate, authorizeAdmin, updateEmployee);
router.delete('/:id', authenticate, authorizeAdmin, deleteEmployee);


module.exports = router;
