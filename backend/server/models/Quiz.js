const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arr => arr.length >= 2, 'Quiz questions must have at least 2 options']
  },
  correctIndex: {
    type: Number,
    required: true,
    default: 0
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a quiz title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a quiz description'],
      trim: true
    },
    timeLimit: {
      type: Number,
      default: 10, // minutes
      min: 1
    },
    passPercentage: {
      type: Number,
      default: 70,
      min: 0,
      max: 100
    },
    category: {
      type: String,
      default: 'General'
    },
    questions: [questionSchema]
  },
  {
    timestamps: true
  }
);

// Virtual property `id` for backwards compatibility with frontend
quizSchema.virtual('id').get(function () {
  return this.customId || this._id.toString();
});

quizSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.customId || ret._id.toString();
    return ret;
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
