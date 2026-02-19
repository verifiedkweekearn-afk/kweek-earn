const express = require('express');
const {
  getTodayTasks,
  completeTask,
  allTasksCompleted
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes are protected
router.get('/today', protect, getTodayTasks);           // line 16
router.put('/complete/:taskListId', protect, completeTask);
router.get('/all-completed', protect, allTasksCompleted);

module.exports = router;
