const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    studentName: {
      type: String,
      default: 'Student'
    },
    quizId: {
      type: String,
      required: true,
      index: true
    },
    quizTitle: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    passed: {
      type: Boolean,
      required: true
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    userAnswers: {
      type: Array,
      default: []
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('QuizResult', quizResultSchema);
