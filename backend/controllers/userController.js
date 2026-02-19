const db = require('../models');
const { User } = db;
const bcrypt = require('bcryptjs');

// @desc    Change password
// @route   PUT /api/user/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/user/notifications
// @access  Private
const updateNotifications = async (req, res) => {
  try {
    const { email, withdrawal, tasks, marketing } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notificationPreferences = {
      email: email ?? user.notificationPreferences.email,
      withdrawal: withdrawal ?? user.notificationPreferences.withdrawal,
      tasks: tasks ?? user.notificationPreferences.tasks,
      marketing: marketing ?? user.notificationPreferences.marketing
    };

    await user.save();

    res.json({ 
      message: 'Notification preferences updated',
      preferences: user.notificationPreferences
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get notification preferences
// @route   GET /api/user/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ preferences: user.notificationPreferences });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update theme preference
// @route   PUT /api/user/theme
// @access  Private
const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const userId = req.user.id;

    if (!theme || !['dark', 'light'].includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme value' });
    }

    const user = await User.findByPk(userId);
    user.themePreference = theme;
    await user.save();

    res.json({ message: 'Theme updated', theme: user.themePreference });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get login history
// @route   GET /api/user/login-history
// @access  Private
const getLoginHistory = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ history: user.loginHistory || [] });
  } catch (error) {
    console.error('Get login history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add login record (called from auth controller)
const addLoginRecord = async (userId, ip, userAgent) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return;

    const loginEntry = {
      timestamp: new Date().toISOString(),
      ip: ip || 'Unknown',
      device: userAgent || 'Unknown',
      location: 'Nigeria' // Placeholder - would need IP geolocation service
    };

    const history = user.loginHistory || [];
    history.unshift(loginEntry);
    
    // Keep only last 20 logins
    if (history.length > 20) history.pop();

    user.loginHistory = history;
    await user.save();
  } catch (error) {
    console.error('Add login record error:', error);
  }
};

// @desc    Delete account permanently (PIN verification only)
// @route   DELETE /api/user
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const { pin } = req.body;
    const userId = req.user.id;

    if (!pin) {
      return res.status(400).json({ message: 'PIN is required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if PIN is locked
    if (user.pinLockUntil && new Date() < user.pinLockUntil) {
      const waitSeconds = Math.ceil((user.pinLockUntil - new Date()) / 1000);
      return res.status(423).json({ 
        message: `Too many attempts. Try again in ${waitSeconds} seconds`,
        locked: true,
        waitSeconds
      });
    }

    // Verify PIN
    if (user.withdrawalPin !== pin) {
      // Increment failed attempts
      user.failedPinAttempts = (user.failedPinAttempts || 0) + 1;
      
      // Lock after 3 failed attempts
      if (user.failedPinAttempts >= 3) {
        user.pinLockUntil = new Date(Date.now() + 5 * 60000); // 5 minutes
        user.failedPinAttempts = 0;
        await user.save();
        return res.status(423).json({ 
          message: 'Too many invalid attempts. Please try again in 5 minutes.',
          locked: true
        });
      }
      
      await user.save();
      return res.status(401).json({ 
        message: `Invalid PIN. ${3 - user.failedPinAttempts} attempts remaining.`
      });
    }

    // PIN is correct - DELETE ACCOUNT IMMEDIATELY
    // No balance check. No pending withdrawal check. User's choice.

    // Store user data for response before deletion
    const username = user.username;
    const email = user.email;

    // Permanently delete the user record
    await user.destroy();

    res.json({ 
      message: 'Account permanently deleted',
      username,
      email
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  changePassword,
  updateNotifications,
  getNotifications,
  updateTheme,
  getLoginHistory,
  addLoginRecord,
  deleteAccount
};
