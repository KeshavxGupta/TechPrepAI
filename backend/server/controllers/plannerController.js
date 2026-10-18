const PlannerTask = require('../models/PlannerTask');

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
    const { studentEmail, title, category, priority, dueDate } = req.body;

    if (!studentEmail || !title) {
      return res.status(400).json({ success: false, message: 'Student email and task title are required' });
    }

    const task = await PlannerTask.create({
      studentEmail: studentEmail.toLowerCase(),
      title,
      category: category || 'General',
      priority: priority || 'Medium',
      dueDate: dueDate || '',
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
