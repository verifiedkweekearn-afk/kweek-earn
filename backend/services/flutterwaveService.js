const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

const verifyBankTransfer = async (reference) => {
  try {
    const response = await flw.Transaction.verify({ id: reference });
    return {
      success: response.data.status === 'successful',
      amount: response.data.amount,
      reference: response.data.tx_ref
    };
  } catch (error) {
    console.error('Flutterwave verification error:', error);
    return { success: false };
  }
};

module.exports = { verifyBankTransfer };
