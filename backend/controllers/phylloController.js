const db = require('../models');
const { User } = db;
const phyllo = require('../config/phyllo');

// @desc    Initialize Phyllo connection for user
// @route   POST /api/phyllo/connect
// @access  Private
const initializeConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user already has Phyllo ID, use it
    if (user.phylloUserId) {
      const sdkToken = await phyllo.generateSdkToken(user.phylloUserId);
      return res.json({
        hasConnected: true,
        sdkToken,
        phylloUserId: user.phylloUserId
      });
    }

    // Create new Phyllo user
    const phylloUser = await phyllo.createPhylloUser(
      user.id,
      user.username
    );

    // Save Phyllo ID to user
    user.phylloUserId = phylloUser.id;
    await user.save();

    // Generate SDK token for frontend
    const sdkToken = await phyllo.generateSdkToken(phylloUser.id);

    res.json({
      hasConnected: false,
      sdkToken,
      phylloUserId: phylloUser.id
    });
  } catch (error) {
    console.error('Phyllo connection error:', error);
    res.status(500).json({ message: 'Failed to initialize connection' });
  }
};

// @desc    Get user's connected social accounts
// @route   GET /api/phyllo/accounts
// @access  Private
const getConnectedAccounts = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user.phylloUserId) {
      return res.json({ accounts: [] });
    }

    const accounts = await phyllo.getConnectedAccounts(user.phylloUserId);
    
    // Update user's connected accounts
    user.connectedAccounts = accounts;
    await user.save();

    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ message: 'Failed to get connected accounts' });
  }
};

// @desc    Verify if user completed a task
// @route   POST /api/phyllo/verify
// @access  Private
const verifyTask = async (req, res) => {
  try {
    const { taskType, target, platform } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user.phylloUserId) {
      return res.status(400).json({ 
        verified: false,
        message: 'Please connect your social accounts first' 
      });
    }

    let verified = false;

    switch(taskType) {
      case 'follow':
        verified = await phyllo.verifyFollow(user.phylloUserId, target, platform);
        break;
      case 'like':
        verified = await phyllo.verifyLike(user.phylloUserId, target, platform);
        break;
      case 'share':
        // For share verification, we'll check if the content was shared
        // This requires the post ID - you'll need to pass it from frontend
        verified = target ? await phyllo.verifyShare(user.phylloUserId, target, platform) : false;
        break;
      default:
        return res.status(400).json({ message: 'Invalid task type' });
    }

    user.lastVerifiedAt = new Date();
    await user.save();

    res.json({
      verified,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Verify task error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

// @desc    Disconnect a social account
// @route   DELETE /api/phyllo/accounts/:accountId
// @access  Private
const disconnectAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const user = await User.findByPk(req.user.id);

    if (!user.connectedAccounts) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Filter out the disconnected account
    user.connectedAccounts = user.connectedAccounts.filter(
      acc => acc.id !== accountId
    );
    await user.save();

    res.json({ message: 'Account disconnected successfully' });
  } catch (error) {
    console.error('Disconnect account error:', error);
    res.status(500).json({ message: 'Failed to disconnect account' });
  }
};

module.exports = {
  initializeConnection,
  getConnectedAccounts,
  verifyTask,
  disconnectAccount
};
