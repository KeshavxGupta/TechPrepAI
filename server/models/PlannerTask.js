const mongoose = require('mongoose');

const plannerTaskSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    priority: {
      type: String,
      default: 'Medium',
      trim: true
    },
    dueDate: {
      type: String,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PlannerTask', plannerTaskSchema);
