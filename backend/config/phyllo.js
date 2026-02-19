const { PhylloConnectApiClient } = require('@fern-api/phyllo');

// Phyllo API credentials – from https://dashboard.getphyllo.com
const PHYLLO_CLIENT_ID = process.env.PHYLLO_CLIENT_ID || 'your_client_id';
const PHYLLO_SECRET = process.env.PHYLLO_SECRET || 'your_secret';
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';

// Initialize Phyllo client
const phylloClient = new PhylloConnectApiClient({
  environment: environment,
  auth: {
    credentials: {
      username: PHYLLO_CLIENT_ID,
      password: PHYLLO_SECRET
    }
  }
});

// Create a Phyllo user (maps to your user)
const createPhylloUser = async (externalUserId, name) => {
  try {
    const response = await phylloClient.users.create({
      external_id: externalUserId,
      name: name
    });
    return response;
  } catch (error) {
    console.error('Phyllo create user error:', error.response?.data || error.message);
    throw error;
  }
};

// Generate SDK token for frontend
const generateSdkToken = async (phylloUserId) => {
  try {
    const response = await phylloClient.sdkTokens.create({
      user_id: phylloUserId,
      products: ['IDENTITY', 'ENGAGEMENT'] // What we want to access
    });
    return response.sdk_token;
  } catch (error) {
    console.error('Phyllo SDK token error:', error.response?.data || error.message);
    throw error;
  }
};

// Get user's connected accounts
const getConnectedAccounts = async (phylloUserId) => {
  try {
    const response = await phylloClient.accounts.list({
      user_id: phylloUserId
    });
    return response.data;
  } catch (error) {
    console.error('Phyllo get accounts error:', error.response?.data || error.message);
    throw error;
  }
};

// Verify if user follows a specific account
const verifyFollow = async (phylloUserId, targetUsername, platform = 'INSTAGRAM') => {
  try {
    // Get user's following list
    const response = await phylloClient.follows.list({
      user_id: phylloUserId,
      platform: platform
    });
    
    const following = response.data;
    return following.some(f => f.username === targetUsername);
  } catch (error) {
    console.error('Phyllo verify follow error:', error.response?.data || error.message);
    return false;
  }
};

// Verify if user liked a specific post
const verifyLike = async (phylloUserId, postId, platform = 'INSTAGRAM') => {
  try {
    const response = await phylloClient.likes.list({
      user_id: phylloUserId,
      platform: platform
    });
    
    const likes = response.data;
    return likes.some(l => l.post_id === postId);
  } catch (error) {
    console.error('Phyllo verify like error:', error.response?.data || error.message);
    return false;
  }
};

module.exports = {
  createPhylloUser,
  generateSdkToken,
  getConnectedAccounts,
  verifyFollow,
  verifyLike
};
