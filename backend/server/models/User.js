const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    profilePic: {
      type: String,
      default: ''
    },
    contact: {
      type: String,
      default: ''
    },
    dob: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    college: {
      type: String,
      default: ''
    },
    degree: {
      type: String,
      default: ''
    },
    branch: {
      type: String,
      default: ''
    },
    specialization: {
      type: String,
      default: ''
    },
    gradYear: {
      type: String,
      default: ''
    },
    cgpa: {
      type: String,
      default: ''
    },
    marks10: {
      type: String,
      default: ''
    },
    marks12: {
      type: String,
      default: ''
    },
    skills: {
      type: String,
      default: ''
    },
    leetcode: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    portfolio: {
      type: String,
      default: ''
    },
    suspended: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Hash password before save if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  // If stored password isn't a bcrypt hash (e.g. plain demo seed), compare plain as well
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  return enteredPassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
