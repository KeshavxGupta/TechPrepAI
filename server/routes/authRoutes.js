const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers,
  toggleSuspend,
  resetPassword
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-suspend', toggleSuspend);
router.put('/users/:id/reset-password', resetPassword);

module.exports = router;
