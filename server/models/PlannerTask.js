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
      enum: ['DSA', 'Resume', 'Aptitude', 'Core CS', 'Interview', 'General'],
      default: 'General'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
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
