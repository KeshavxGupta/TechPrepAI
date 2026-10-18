const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      sparse: true,
      index: true
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Please provide job role'],
      trim: true
    },
    package: {
      type: String,
      default: '0.0'
    },
    deadline: {
      type: String,
      default: ''
    },
    interviewDate: {
      type: String,
      default: ''
    },
    eligibility: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['wishlist', 'applied', 'assessment', 'interview', 'selected', 'rejected'],
      default: 'wishlist'
    },
    link: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    studentEmail: {
      type: String,
      default: null, // null means master drive available to all students
      lowercase: true,
      trim: true,
      index: true
    },
    appliedDate: {
      type: String,
      default: null
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

placementSchema.virtual('id').get(function () {
  return this.customId || this._id.toString();
});

placementSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.customId || ret._id.toString();
    return ret;
  }
});

module.exports = mongoose.model('Placement', placementSchema);
