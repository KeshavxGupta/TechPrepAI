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
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error'],
      default: 'Accepted'
    },
    runtime: {
      type: String,
      default: '54ms'
    },
    memory: {
      type: String,
      default: '42.1MB'
    },
    passedCases: {
      type: Number,
      default: 0
    },
    totalCases: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DsaSubmission', dsaSubmissionSchema);
