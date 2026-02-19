const express = require('express');
const { getAllWithdrawals, generateWithdrawalPin, markAsSent } = require('../controllers/adminWithdrawalController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

const router = express.Router();

router.use(protectAdmin);
router.get('/withdrawals', getAllWithdrawals);
router.post('/withdrawals/:id/generate-pin', generateWithdrawalPin);
router.post('/withdrawals/:id/mark-sent', markAsSent);

module.exports = router;
