const DsaProblem = require('../models/DsaProblem');
const DsaSubmission = require('../models/DsaSubmission');

// @desc    Get all DSA problems
// @route   GET /api/dsa/problems
// @access  Public
exports.getProblems = async (req, res, next) => {
  try {
    const problems = await DsaProblem.find().sort({ problemId: 1 });
    res.status(200).json({ success: true, count: problems.length, problems });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single DSA problem
// @route   GET /api/dsa/problems/:problemId
// @access  Public
exports.getProblemById = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const problem = await DsaProblem.findOne({ problemId });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }
    res.status(200).json({ success: true, problem });
  } catch (error) {
    next(error);
  }
};

// @desc    Execute code and run test cases
// @route   POST /api/dsa/run
// @access  Public
const compilerService = require('../services/compilerService');

const DEFAULT_TEST_CASES = {
  'two-sum': [
    { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
    { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
    { input: '[3,3]\n6', expectedOutput: '[0,1]' }
  ],
  'valid-anagram': [
    { input: '"anagram"\n"nagaram"', expectedOutput: 'true' },
    { input: '"rat"\n"car"', expectedOutput: 'false' }
  ],
  'reverse-linked-list': [
    { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
    { input: '[1,2]', expectedOutput: '[2,1]' }
  ],
  'container-with-most-water': [
    { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
    { input: '[1,1]', expectedOutput: '1' }
  ],
  'coin-change': [
    { input: '[1,2,5]\n11', expectedOutput: '3' },
    { input: '[2]\n3', expectedOutput: '-1' }
  ]
};

function normalizeSlug(id) {
  if (!id) return 'two-sum';
  return id.replace(/^p_/, '').replace(/_/g, '-').toLowerCase();
}

exports.runCode = async (req, res, next) => {
  try {
    const { problemId, language, code, customInput } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }

    const slug = normalizeSlug(problemId);

    // If user specified custom input, run single execution
    if (customInput !== undefined && customInput !== null && customInput.trim() !== '') {
      const result = await compilerService.runCode({
        language: language || 'javascript',
        code,
        customInput,
        problemSlug: slug
      });
      return res.status(200).json({ success: true, result });
    }

    // Otherwise, evaluate sample test cases
    const testCases = DEFAULT_TEST_CASES[slug] || [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' }
    ];

    const result = await compilerService.evaluateTestCases({
      language: language || 'javascript',
      code,
      problemSlug: slug,
      testCases
    });

    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit DSA solution
// @route   POST /api/dsa/submit
// @access  Public
exports.submitSolution = async (req, res, next) => {
  try {
    const { studentEmail, problemId, language, code } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({ success: false, message: 'Missing problem or code' });
    }

    const slug = normalizeSlug(problemId);
    const testCases = DEFAULT_TEST_CASES[slug] || [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]' }
    ];

    const evaluation = await compilerService.evaluateTestCases({
      language: language || 'javascript',
      code,
      problemSlug: slug,
      testCases
    });

    const submission = await DsaSubmission.create({
      studentEmail: (studentEmail || 'guest@techprepai.com').toLowerCase(),
      problemId: slug,
      language: language || 'javascript',
      code,
      status: evaluation.status || 'Accepted',
      runtime: evaluation.runtime || '0 ms',
      memory: `${evaluation.memoryMb || '40.0'} MB`,
      passedCases: evaluation.passedCases !== undefined ? evaluation.passedCases : testCases.length,
      totalCases: testCases.length
    });

    res.status(201).json({
      success: true,
      message: evaluation.status === 'Accepted' ? 'Solution accepted! All test cases passed.' : `Submission Verdict: ${evaluation.status}`,
      evaluation,
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user DSA submissions and solved list
// @route   GET /api/dsa/submissions/user/:email
// @access  Public
exports.getUserSubmissions = async (req, res, next) => {
  try {
    const { email } = req.params;
    const submissions = await DsaSubmission.find({ studentEmail: email.toLowerCase() }).sort({ createdAt: -1 });

    const solvedProblemIds = [...new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId))];

    res.status(200).json({
      success: true,
      totalSubmissions: submissions.length,
      solvedCount: solvedProblemIds.length,
      solvedProblemIds,
      submissions
    });
  } catch (error) {
    next(error);
  }
};
