const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
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
      default: 'My Software Engineer Resume',
      trim: true
    },
    template: {
      type: String,
      default: 'modern'
    },
    personalInfo: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    summary: {
      type: String,
      default: ''
    },
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: String,
        endDate: String,
        grade: String,
        description: String
      }
    ],
    experience: [
      {
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        highlights: [String]
      }
    ],
    projects: [
      {
        title: String,
        techStack: [String],
        liveUrl: String,
        githubUrl: String,
        description: String,
        highlights: [String]
      }
    ],
    skills: {
      languages: [String],
      frameworks: [String],
      developerTools: [String],
      coreConcepts: [String]
    },
    certifications: [
      {
        title: String,
        issuer: String,
        issueDate: String,
        credentialUrl: String
      }
    ],
    atsScore: {
      type: Number,
      default: 0
    },
    atsFeedback: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
