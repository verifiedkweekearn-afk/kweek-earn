const db = require('../models');
const { Task, User, DailyTaskList } = db;
const { Op } = require('sequelize');

const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 100, platform, action, active } = req.query;

    const where = {};
    if (platform) where.platform = platform;
    if (action) where.action = action;
    if (active !== undefined) where.active = active === 'true';

    const tasks = await Task.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      tasks: tasks.rows,
      total: tasks.count,
      page: parseInt(page),
      pages: Math.ceil(tasks.count / parseInt(limit))
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addTask = async (req, res) => {
  try {
    const { platform, action, handle, verified, reward, url } = req.body;

    if (!platform || !action || !handle || !reward) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingTask = await Task.findOne({
      where: {
        platform,
        action,
        handle
      }
    });

    if (existingTask) {
      return res.status(400).json({ message: 'Task already exists' });
    }

    const task = await Task.create({
      platform,
      action,
      handle,
      verified: verified || false,
      reward,
      url: url || null,
      active: true
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Add task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update(updates);
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Soft delete by setting active = false
    await task.update({ active: false });
    
    res.json({ message: 'Task deactivated successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const forceAssignTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { count = 55 } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get tasks user has never completed
    const completedTaskIds = await db.CompletedTask.findAll({
      where: { userId },
      attributes: ['taskId']
    }).then(rows => rows.map(r => r.taskId));

    const availableTasks = await Task.findAll({
      where: {
        active: true,
        id: { [Op.notIn]: completedTaskIds }
      }
    });

    if (availableTasks.length === 0) {
      return res.status(400).json({ message: 'No available tasks for this user' });
    }

    const shuffled = [...availableTasks].sort(() => 0.5 - Math.random());
    const selectedTasks = shuffled.slice(0, Math.min(count, availableTasks.length));
    
    const today = new Date().toISOString().split('T')[0];
    const assignments = selectedTasks.map(task => ({
      userId,
      taskId: task.id,
      assignedDate: today,
      status: 'pending'
    }));

    await DailyTaskList.bulkCreate(assignments);

    res.json({
      message: `Assigned ${assignments.length} tasks to user`,
      count: assignments.length
    });
  } catch (error) {
    console.error('Force assign tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  forceAssignTasks
};
