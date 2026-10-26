const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
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
    content: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    color: {
      type: String,
      default: '#3b82f6',
      trim: true
    },
    activeRecall: {
      type: Boolean,
      default: false
    },
    srInterval: {
      type: String,
      default: 'standard',
      trim: true
    },
    isPinned: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Note', noteSchema);
