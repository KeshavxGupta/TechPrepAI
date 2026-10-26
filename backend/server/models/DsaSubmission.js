const mongoose = require('mongoose');

const dsaSubmissionSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    problemId: {
      type: String,
      required: true,
      index: true
    },
    language: {
      type: String,
      default: 'javascript'
    },
    code: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'Accepted'
    },
    actionType: {
      type: String,
      enum: ['run', 'submit'],
      default: 'submit',
      index: true
    },
    source: {
      type: String,
      enum: ['ide', 'quiz'],
      default: 'ide'
    },
    problemTitle: {
      type: String,
      default: ''
    },
    runtime: {
      type: String,
      default: '0 ms'
    },
    runtimeMs: {
      type: Number,
      default: 0
    },
    memory: {
      type: String,
      default: '40.0 MB'
    },
    memoryMb: {
      type: Number,
      default: 0
    },
    passedCases: {
      type: Number,
      default: 0
    },
    totalCases: {
      type: Number,
      default: 0
    },
    testResults: {
      type: Array,
      default: []
    },
    quizContext: {
      quizId: String,
      quizTitle: String,
      questionIdx: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DsaSubmission', dsaSubmissionSchema);
