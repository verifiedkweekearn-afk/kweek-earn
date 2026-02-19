const express = require('express');
const {
  initializeConnection,
  getConnectedAccounts,
  verifyTask,
  disconnectAccount
} = require('../controllers/phylloController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All Phyllo routes are protected (user must be logged in)
router.post('/connect', protect, initializeConnection);
router.get('/accounts', protect, getConnectedAccounts);
router.post('/verify', protect, verifyTask);
router.delete('/accounts/:accountId', protect, disconnectAccount);

module.exports = router;
