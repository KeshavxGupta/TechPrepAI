const mongoose = require('mongoose');

const dsaProblemSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    category: {
      type: String,
      default: 'Arrays'
    },
    description: {
      type: String,
      required: true
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String
      }
    ],
    constraints: [String],
    starterCode: {
      javascript: String,
      python: String,
      cpp: String,
      java: String
    },
    solution: {
      type: String,
      default: ''
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DsaProblem', dsaProblemSchema);
