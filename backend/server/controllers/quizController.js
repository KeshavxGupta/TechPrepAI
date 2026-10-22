const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

// In-memory cache for ultra-fast quiz delivery (<2ms response)
let quizzesCache = null;
let lastQuizzesCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function invalidateQuizzesCache() {
  quizzesCache = null;
  lastQuizzesCacheTime = 0;
}

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
exports.getQuizzes = async (req, res, next) => {
  try {
    const now = Date.now();
    if (quizzesCache && Array.isArray(quizzesCache) && (now - lastQuizzesCacheTime < CACHE_TTL_MS)) {
      return res.status(200).json({ success: true, count: quizzesCache.length, quizzes: quizzesCache, cached: true });
    }

    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    quizzesCache = quizzes;
    lastQuizzesCacheTime = now;
    res.status(200).json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    if (quizzesCache && Array.isArray(quizzesCache) && quizzesCache.length > 0) {
      return res.status(200).json({ success: true, count: quizzesCache.length, quizzes: quizzesCache, cached: true, fallback: true });
    }
    next(error);
  }
};

// @desc    Get single quiz by id
// @route   GET /api/quizzes/:id
// @access  Public
exports.getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let quiz = await Quiz.findOne({ customId: id });
    if (!quiz && id.match(/^[0-9a-fA-F]{24}$/)) {
      quiz = await Quiz.findById(id);
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.status(200).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a quiz
// @route   POST /api/quizzes
// @access  Public / Admin
exports.saveQuiz = async (req, res, next) => {
  try {
    const { id, customId, title, description, timeLimit, passPercentage, category, questions } = req.body;

    const quizIdentifier = id || customId || `quiz_${Date.now()}`;

    let quiz = await Quiz.findOne({ customId: quizIdentifier });
    if (!quiz && quizIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      quiz = await Quiz.findById(quizIdentifier);
    }

    if (quiz) {
      quiz.title = title || quiz.title;
      quiz.description = description || quiz.description;
      quiz.timeLimit = timeLimit !== undefined ? timeLimit : quiz.timeLimit;
      quiz.passPercentage = passPercentage !== undefined ? passPercentage : quiz.passPercentage;
      quiz.category = category || quiz.category;
      if (questions) quiz.questions = questions;
      await quiz.save();

      invalidateQuizzesCache();
      return res.status(200).json({ success: true, message: 'Quiz updated successfully', quiz });
    }

    quiz = await Quiz.create({
      customId: quizIdentifier,
      title,
      description,
      timeLimit: timeLimit || 10,
      passPercentage: passPercentage || 70,
      category: category || 'General',
      questions: questions || []
    });

    invalidateQuizzesCache();
    res.status(201).json({ success: true, message: 'Quiz created successfully', quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Public / Admin
exports.deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    let quiz = await Quiz.findOneAndDelete({ customId: id });
    if (!quiz && id.match(/^[0-9a-fA-F]{24}$/)) {
      quiz = await Quiz.findByIdAndDelete(id);
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    invalidateQuizzesCache();
    res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a quiz result
// @route   POST /api/quizzes/results
// @access  Public
exports.submitQuizResult = async (req, res, next) => {
  try {
    const {
      studentEmail,
      studentName,
      quizId,
      customId,
      quizTitle,
      score,
      scoreFraction,
      scorePercent,
      percentage,
      totalQuestions,
      passed,
      status,
      timeSpentSeconds,
      violations,
      submissionReason,
      userAnswers
    } = req.body;

    const quizIdentifier = quizId || customId;
    if (!quizIdentifier) {
      return res.status(400).json({ success: false, message: 'Missing quiz identifier' });
    }

    const calcPercentage = percentage !== undefined ? Number(percentage) : (scorePercent !== undefined ? Number(scorePercent) : 0);
    const calcPassed = passed !== undefined ? Boolean(passed) : (status === 'PASSED');
    const calcScore = score !== undefined ? Number(score) : (scoreFraction ? parseInt(scoreFraction, 10) || 0 : 0);
    const calcTotal = totalQuestions !== undefined ? Number(totalQuestions) : (scoreFraction && scoreFraction.includes('/') ? parseInt(scoreFraction.split('/')[1], 10) || 1 : 1);

    const result = await QuizResult.create({
      studentEmail: (studentEmail || 'guest@techprepai.com').toLowerCase(),
      studentName: studentName || 'Student',
      quizId: quizIdentifier,
      quizTitle: quizTitle || 'Assessment',
      score: calcScore,
      totalQuestions: calcTotal,
      percentage: calcPercentage,
      passed: calcPassed,
      status: calcPassed ? 'PASSED' : 'FAILED',
      timeSpentSeconds: timeSpentSeconds || 0,
      violations: violations || 0,
      submissionReason: submissionReason || 'Normal Submission',
      userAnswers: userAnswers || [],
      timestamp: new Date()
    });

    res.status(201).json({ success: true, message: 'Quiz attempt recorded', result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz results by student email
// @route   GET /api/quizzes/results/user/:email
// @access  Public
exports.getStudentResults = async (req, res, next) => {
  try {
    const { email } = req.params;
    const results = await QuizResult.find({ studentEmail: email.toLowerCase() }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: results.length, results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quiz results telemetry (Admin)
// @route   GET /api/quizzes/results
// @access  Public / Admin
exports.getAllResults = async (req, res, next) => {
  try {
    const results = await QuizResult.find().sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ success: true, count: results.length, results });
  } catch (error) {
    next(error);
  }
};
