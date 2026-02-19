const express = require('express');
const {
  changePassword,
  updateNotifications,
  getNotifications,
  updateTheme,
  getLoginHistory,
  deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes are protected
router.put('/password', protect, changePassword);
router.put('/notifications', protect, updateNotifications);
router.get('/notifications', protect, getNotifications);
router.put('/theme', protect, updateTheme);
router.get('/login-history', protect, getLoginHistory);
router.delete('/', protect, deleteAccount);

module.exports = router;
