const { sequelize } = require('./config/db');
const { WithdrawalRequest, User } = require('./models');
const generatePin = require('./utils/generatePin');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const verifyPayment = async () => {
  try {
    await sequelize.authenticate();
    
    const pending = await WithdrawalRequest.findAll({
      where: { status: 'pending_fee' },
      include: [{ model: User, attributes: ['username', 'email'] }]
    });

    if (pending.length === 0) {
      console.log('No pending withdrawals found');
      process.exit(0);
    }

    console.log('\n📋 PENDING WITHDRAWALS:\n');
    pending.forEach((w, i) => {
      console.log(`${i + 1}. ID: ${w.id}`);
      console.log(`   User: ${w.User?.username}`);
      console.log(`   Amount: ₦${w.amount}`);
      console.log(`   Bank: ${w.bankName} - ${w.accountNumber}`);
      console.log(`   Expires: ${w.expiresAt}\n`);
    });

    rl.question('\nEnter withdrawal ID to verify (or q to quit): ', async (answer) => {
      if (answer.toLowerCase() === 'q') {
        process.exit(0);
      }

      const request = await WithdrawalRequest.findByPk(answer);
      if (!request) {
        console.log('❌ Withdrawal not found');
        process.exit(1);
      }

      const pin = generatePin();
      request.status = 'pin_generated';
      request.feePaid = true;
      request.pin = pin;
      request.pinGeneratedAt = new Date();
      await request.save();

      console.log(`\n✅ Payment verified for ₦${request.amount}`);
      console.log(`✅ PIN generated: ${pin}`);
      console.log(`✅ User can now complete withdrawal`);

      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyPayment();
