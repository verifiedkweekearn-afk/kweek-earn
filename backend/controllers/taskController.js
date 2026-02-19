const db = require('../models');
const { UserTask, Task, User, TaskCompletion } = db;

// Get today's tasks
const getTodayTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const tasks = await UserTask.findAll({
      where: {
        userId,
        assignedDate: today,
        status: 'pending'
      },
      include: [{
        model: Task,
        attributes: ['platform', 'action', 'handle', 'verified', 'reward']
      }],
      order: [['createdAt', 'ASC']]
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Complete a task
const completeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskListId } = req.params;

    console.log(`Completing task ${taskListId} for user ${userId}`);

    // Find the task
    const taskEntry = await UserTask.findOne({
      where: {
        id: taskListId,
        userId,
        status: 'pending'
      },
      include: [{ model: Task }]
    });

    if (!taskEntry) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const reward = taskEntry.Task ? taskEntry.Task.reward : 0;
    const taskId = taskEntry.Task.id;

    // Update task status
    taskEntry.status = 'completed';
    taskEntry.completedAt = new Date();
    await taskEntry.save();

    // Record completion for cooldown
    await TaskCompletion.findOrCreate({
      where: { userId, taskId },
      defaults: { completedAt: new Date() }
    });

    // Update user balance
    const user = await User.findByPk(userId);
    user.balance += reward;
    await user.save();

    console.log(`Task completed. New balance: ₦${user.balance}`);

    res.json({
      message: 'Task completed',
      reward,
      newBalance: user.balance
    });

  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if all tasks completed
const allTasksCompleted = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const pendingCount = await UserTask.count({
      where: {
        userId,
        assignedDate: today,
        status: 'pending'
      }
    });

    res.json({
      allCompleted: pendingCount === 0,
      pendingTasks: pendingCount
    });
  } catch (error) {
    console.error('Check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTodayTasks,
  completeTask,
  allTasksCompleted
};
