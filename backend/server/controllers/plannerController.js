const PlannerTask = require('../models/PlannerTask');
const Note = require('../models/Note');

// ==========================================
// PLANNER TASKS CONTROLLERS
// ==========================================

// @desc    Get all planner tasks for a student
// @route   GET /api/planner/tasks/user/:email
// @access  Public
exports.getUserTasks = async (req, res, next) => {
  try {
    const { email } = req.params;
    const tasks = await PlannerTask.find({ studentEmail: email.toLowerCase() }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new planner task
// @route   POST /api/planner/tasks
// @access  Public
exports.createTask = async (req, res, next) => {
  try {
    const { studentEmail, title, category, type, priority, dueDate, deadline, resourceLink } = req.body;

    if (!studentEmail || !title) {
      return res.status(400).json({ success: false, message: 'Student email and task title are required' });
    }

    const task = await PlannerTask.create({
      studentEmail: studentEmail.toLowerCase(),
      title,
      category: category || type || 'General',
      type: type || category || 'daily',
      priority: priority || 'Medium',
      dueDate: dueDate || deadline || '',
      deadline: deadline || dueDate || '',
      resourceLink: resourceLink || '',
      completed: false
    });

    res.status(201).json({ success: true, message: 'Task created', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/planner/tasks/:id/toggle
// @access  Public
exports.toggleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await PlannerTask.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    await task.save();

    res.status(200).json({ success: true, message: 'Task updated', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/planner/tasks/:id
// @access  Public
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await PlannerTask.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// STUDY NOTES CONTROLLERS (100% MongoDB Atlas)
// ==========================================

// @desc    Get all study notes for a student
// @route   GET /api/planner/notes/user/:email
// @access  Public
exports.getUserNotes = async (req, res, next) => {
  try {
    const { email } = req.params;
    const notes = await Note.find({ studentEmail: email.toLowerCase() }).sort({ isPinned: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a study note
// @route   POST /api/planner/notes
// @access  Public
exports.createNote = async (req, res, next) => {
  try {
    const { studentEmail, title, content, category, color, activeRecall, srInterval, isPinned } = req.body;

    if (!studentEmail || !title) {
      return res.status(400).json({ success: false, message: 'Student email and note title are required' });
    }

    const note = await Note.create({
      studentEmail: studentEmail.toLowerCase(),
      title,
      content: content || '',
      category: category || 'General',
      color: color || '#3b82f6',
      activeRecall: Boolean(activeRecall),
      srInterval: srInterval || 'standard',
      isPinned: Boolean(isPinned)
    });

    res.status(201).json({ success: true, message: 'Note created', note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a study note
// @route   PUT /api/planner/notes/:id
// @access  Public
exports.updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category, color, activeRecall, srInterval, isPinned } = req.body;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;
    if (color !== undefined) note.color = color;
    if (activeRecall !== undefined) note.activeRecall = Boolean(activeRecall);
    if (srInterval !== undefined) note.srInterval = srInterval;
    if (isPinned !== undefined) note.isPinned = Boolean(isPinned);

    await note.save();
    res.status(200).json({ success: true, message: 'Note updated', note });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin note
// @route   PATCH /api/planner/notes/:id/pin
// @access  Public
exports.togglePinNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({ success: true, message: 'Note pin updated', note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a study note
// @route   DELETE /api/planner/notes/:id
// @access  Public
exports.deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
