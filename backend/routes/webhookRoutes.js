const express = require('express');
const crypto = require('crypto');
const db = require('../models');
const { WithdrawalRequest } = db;

const router = express.Router();

// Flutterwave webhook endpoint
router.post('/flutterwave', async (req, res) => {
  try {
    // Verify webhook signature
    const secretHash = process.env.FLW_WEBHOOK_SECRET || 'your_webhook_secret';
    const signature = req.headers['verif-hash'];
    
    if (!signature || signature !== secretHash) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = req.body;
    console.log('Flutterwave webhook received:', event.event);

    // Handle charge.completed event
    if (event.event === 'charge.completed') {
      const { tx_ref, id, amount, status, currency } = event.data;
      
      // Extract request ID from tx_ref (format: KWK-<requestId>-<timestamp>)
      const requestId = tx_ref?.split('-')[1];
      
      if (requestId && status === 'successful' && amount === 7000 && currency === 'NGN') {
        const withdrawalRequest = await WithdrawalRequest.findByPk(requestId);
        
        if (withdrawalRequest && withdrawalRequest.status === 'pending_fee') {
          // Generate PIN
          const generatePin = require('../utils/generatePin');
          const pin = generatePin();
          
          withdrawalRequest.status = 'pin_generated';
          withdrawalRequest.feePaid = true;
          withdrawalRequest.pin = pin;
          withdrawalRequest.pinGeneratedAt = new Date();
          withdrawalRequest.flutterwaveReference = id;
          withdrawalRequest.flutterwaveStatus = status;
          await withdrawalRequest.save();
          
          console.log(`✅ PIN generated for withdrawal ${requestId}: ${pin}`);
        }
      }
    }

    // Always return 200 OK to Flutterwave
    res.status(200).json({ message: 'Webhook received' });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
