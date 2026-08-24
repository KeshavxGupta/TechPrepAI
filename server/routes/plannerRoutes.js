const express = require('express');
const router = express.Router();
const {
  getUserTasks,
  createTask,
  toggleTask,
  deleteTask
} = require('../controllers/plannerController');

router.post('/tasks', createTask);
router.get('/tasks/user/:email', getUserTasks);
router.patch('/tasks/:id/toggle', toggleTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;
