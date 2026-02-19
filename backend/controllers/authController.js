const db = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = db.User;
const Task = db.Task;
const DailyTaskList = db.DailyTaskList;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'kweekearn_secret_key_change_me', {
    expiresIn: '30d'
  });
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ 
      where: { 
        email: email.toLowerCase() 
      } 
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password
    });

    // Assign 55 random tasks immediately after signup
    const availableTasks = await Task.findAll({
      where: { active: true }
    });

    if (availableTasks.length > 0) {
      const shuffled = [...availableTasks].sort(() => 0.5 - Math.random());
      const selectedTasks = shuffled.slice(0, 55);
      
      const today = new Date().toISOString().split('T')[0];
      const assignments = selectedTasks.map(task => ({
        userId: user.id,
        taskId: task.id,
        assignedDate: today,
        status: 'pending'
      }));

      await DailyTaskList.bulkCreate(assignments);
    }

    if (user) {
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        themePreference: user.themePreference,
        referralCode: user.referralCode,
        token: generateToken(user.id)
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase() 
      } 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
      themePreference: user.themePreference,
      referralCode: user.referralCode,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  getMe
};
