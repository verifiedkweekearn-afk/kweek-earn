const express = require('express');
const { registerAdmin, loginAdmin, checkSignupAvailable } = require('../controllers/adminAuthController');

const router = express.Router();

router.get('/available', checkSignupAvailable);
router.post('/signup', registerAdmin);
router.post('/login', loginAdmin);

module.exports = router;
