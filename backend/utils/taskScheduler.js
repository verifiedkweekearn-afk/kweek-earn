const cron = require('node-cron');
const { Op } = require('sequelize');
const db = require('../models');
const { Task, UserTask, TaskCompletion, User } = db;

const TASKS_PER_DAY = 55;
const COOLDOWN_DAYS = 90; // 3 months

// Check if tasks exist for a date
const tasksExistForDate = async (date) => {
  const count = await UserTask.count({ where: { assignedDate: date } });
  return count > 0;
};

// Get available tasks for a user (excluding completed ones)
const getAvailableTasksForUser = async (userId) => {
  // Find tasks completed in last 90 days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - COOLDOWN_DAYS);
  
  const recentCompletions = await TaskCompletion.findAll({
    where: {
      userId,
      completedAt: { [Op.gte]: cutoffDate }
    },
    attributes: ['taskId']
  });
  
  const excludedTaskIds = recentCompletions.map(c => c.taskId);
  
  // Get all active tasks not recently completed
  return await Task.findAll({
    where: {
      active: true,
      id: { [Op.notIn]: excludedTaskIds }
    }
  });
};

// Assign tasks for a specific date
const assignTasksForDate = async (targetDate) => {
  try {
    console.log(`Checking tasks for date: ${targetDate}`);
    
    const exists = await tasksExistForDate(targetDate);
    if (exists) {
      console.log(`Tasks already exist for ${targetDate}`);
      return;
    }

    console.log(`Assigning tasks for ${targetDate}...`);
    
    const users = await User.findAll({ where: { isActive: true } });
    
    for (const user of users) {
      // Get available tasks for this user
      const availableTasks = await getAvailableTasksForUser(user.id);
      
      if (availableTasks.length === 0) {
        console.log(`No available tasks for user ${user.username}`);
        continue;
      }
      
      // Select random tasks
      const shuffled = [...availableTasks].sort(() => 0.5 - Math.random());
      const selectedTasks = shuffled.slice(0, TASKS_PER_DAY);
      
      const assignments = selectedTasks.map(task => ({
        userId: user.id,
        taskId: task.id,
        assignedDate: targetDate,
        status: 'pending'
      }));
      
      await UserTask.bulkCreate(assignments);
      console.log(`Assigned ${assignments.length} tasks to ${user.username}`);
    }
    
  } catch (error) {
    console.error('Task assignment error:', error);
  }
};

// Initialize task system
const initTaskSystem = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('Task system initializing...');
    console.log(`Today's date: ${today}`);
    
    await assignTasksForDate(today);
    
    // Check yesterday
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const yesterdayExists = await tasksExistForDate(yesterday);
    if (!yesterdayExists) {
      console.log(`Yesterday's tasks missing. Assigning for ${yesterday}...`);
      await assignTasksForDate(yesterday);
    }
    
    console.log('Task system ready');
    
  } catch (error) {
    console.error('Task system initialization error:', error);
  }
};

// Schedule daily task assignment
const initTaskScheduler = () => {
  initTaskSystem();
  
  cron.schedule('1 0 * * *', async () => {
    console.log('Running scheduled task assignment...');
    const today = new Date().toISOString().split('T')[0];
    await assignTasksForDate(today);
  });

  console.log('Task scheduler initialized');
};

module.exports = initTaskScheduler;
