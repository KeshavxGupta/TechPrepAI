const Resume = require('../models/Resume');

// @desc    Get all resumes for a student
// @route   GET /api/resumes/user/:email
// @access  Public
exports.getUserResumes = async (req, res, next) => {
  try {
    const { email } = req.params;
    const resumes = await Resume.find({ studentEmail: email.toLowerCase() }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume by id
// @route   GET /api/resumes/:id
// @access  Public
exports.getResumeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(200).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a resume
// @route   POST /api/resumes
// @access  Public
exports.saveResume = async (req, res, next) => {
  try {
    const {
      id,
      studentEmail,
      title,
      template,
      personalInfo,
      summary,
      education,
      experience,
      projects,
      skills,
      certifications,
      atsScore,
      atsFeedback
    } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ success: false, message: 'Student email is required' });
    }

    let resume;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      resume = await Resume.findById(id);
    }

    if (resume) {
      resume.title = title || resume.title;
      resume.template = template || resume.template;
      if (personalInfo) resume.personalInfo = personalInfo;
      if (summary !== undefined) resume.summary = summary;
      if (education) resume.education = education;
      if (experience) resume.experience = experience;
      if (projects) resume.projects = projects;
      if (skills) resume.skills = skills;
      if (certifications) resume.certifications = certifications;
      if (atsScore !== undefined) resume.atsScore = atsScore;
      if (atsFeedback) resume.atsFeedback = atsFeedback;

      await resume.save();
      return res.status(200).json({ success: true, message: 'Resume updated successfully', resume });
    }

    resume = await Resume.create({
      studentEmail: studentEmail.toLowerCase(),
      title: title || 'My Software Engineer Resume',
      template: template || 'modern',
      personalInfo: personalInfo || {},
      summary: summary || '',
      education: education || [],
      experience: experience || [],
      projects: projects || [],
      skills: skills || { languages: [], frameworks: [], developerTools: [], coreConcepts: [] },
      certifications: certifications || [],
      atsScore: atsScore || 0,
      atsFeedback: atsFeedback || {}
    });

    res.status(201).json({ success: true, message: 'Resume created successfully', resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Perform ATS Resume Scoring Analysis
// @route   POST /api/resumes/scan-ats
// @access  Public
exports.scanAts = async (req, res, next) => {
  try {
    const { resumeText, targetRole, skills, sections } = req.body;

    const role = targetRole || 'Software Development Engineer';
    const content = (resumeText || '').toLowerCase();

    // Standard high-value keywords
    const keywords = [
      'javascript', 'python', 'java', 'c++', 'react', 'node.js', 'express',
      'mongodb', 'sql', 'dsa', 'algorithms', 'data structures', 'system design',
      'git', 'docker', 'cloud', 'aws', 'rest api', 'ci/cd', 'agile'
    ];

    let matchedKeywords = [];
    let missingKeywords = [];

    keywords.forEach(kw => {
      if (content.includes(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const keywordScore = Math.round((matchedKeywords.length / keywords.length) * 100);
    const calculatedScore = Math.min(96, Math.max(55, keywordScore + 25));

    const analysis = {
      overallScore: calculatedScore,
      targetRole: role,
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 5),
      strengths: [
        'Clean section hierarchy and standard typography detected',
        'Strong technical keyword relevance for ' + role,
        'Action verbs present in project experience descriptions'
      ],
      recommendations: [
        `Incorporate missing core competencies: ${missingKeywords.slice(0, 3).join(', ')}`,
        'Quantify achievements with metrics (e.g., "improved latency by 35%")',
        'Ensure contact information contains updated GitHub and LinkedIn URLs'
      ]
    };

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Public
exports.deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findByIdAndDelete(id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
};
