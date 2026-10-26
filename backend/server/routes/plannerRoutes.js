const express = require('express');
const router = express.Router();
const {
  getUserTasks,
  createTask,
  toggleTask,
  deleteTask,
  getUserNotes,
  createNote,
  updateNote,
  togglePinNote,
  deleteNote
} = require('../controllers/plannerController');

router.post('/tasks', createTask);
router.get('/tasks/user/:email', getUserTasks);
router.patch('/tasks/:id/toggle', toggleTask);
router.delete('/tasks/:id', deleteTask);

// Notes Routes (100% MongoDB Atlas)
router.get('/notes/user/:email', getUserNotes);
router.post('/notes', createNote);
router.put('/notes/:id', updateNote);
router.patch('/notes/:id/pin', togglePinNote);
router.delete('/notes/:id', deleteNote);

module.exports = router;
