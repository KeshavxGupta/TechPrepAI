const User = require('../models/User');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Placement = require('../models/Placement');
const Resume = require('../models/Resume');
const DsaProblem = require('../models/DsaProblem');

// @desc    Get aggregated Admin telemetry and system metrics
// @route   GET /api/admin/telemetry
// @access  Public / Admin
exports.getTelemetry = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const suspendedUsers = await User.countDocuments({ suspended: true, role: { $ne: 'admin' } });
    const activeUsers = totalUsers - suspendedUsers;

    const allStudents = await User.find({ role: { $ne: 'admin' } });
    let totalCgpa = 0;
    let studentsWithCgpa = 0;
    let completeProfiles = 0;

    const requiredFields = [
      'profilePic', 'contact', 'dob', 'address', 'college', 'degree',
      'branch', 'specialization', 'gradYear', 'cgpa', 'marks10', 'marks12',
      'skills', 'leetcode', 'github', 'linkedin', 'portfolio'
    ];

    allStudents.forEach(u => {
      const cg = parseFloat(u.cgpa);
      if (!isNaN(cg) && cg > 0) {
        totalCgpa += cg;
        studentsWithCgpa++;
      }
      let filled = 0;
      requiredFields.forEach(f => {
        if (u[f] && String(u[f]).trim() !== '') filled++;
      });
      if (filled === requiredFields.length) completeProfiles++;
    });

    const avgCgpa = studentsWithCgpa > 0 ? (totalCgpa / studentsWithCgpa).toFixed(2) : '0.00';
    const incompleteProfiles = totalUsers - completeProfiles;

    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await QuizResult.countDocuments();
    const totalPlacements = await Placement.countDocuments({ studentEmail: null });
    const totalResumes = await Resume.countDocuments();
    const totalDsaProblems = await DsaProblem.countDocuments();

    res.status(200).json({
      success: true,
      telemetry: {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          completeProfiles,
          incompleteProfiles,
          avgCgpa
        },
        quizzes: {
          total: totalQuizzes,
          totalAttempts
        },
        placements: {
          totalDrives: totalPlacements
        },
        dsa: {
          totalProblems: totalDsaProblems
        },
        resumes: {
          totalResumes
        },
        system: {
          nodeVersion: process.version,
          uptime: process.uptime(),
          status: 'Optimal',
          database: 'MongoDB Atlas / Local Connected'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
