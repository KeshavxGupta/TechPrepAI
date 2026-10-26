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
  'valid-palindrome': [
    { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
    { input: '"race a car"', expectedOutput: 'false' },
    { input: '" "', expectedOutput: 'true' }
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
    const { problemId, language, code, customInput, testCases: reqTestCases, studentEmail, source, quizContext, problemTitle } = req.body;

    if (code === undefined || code === null) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }

    const slug = normalizeSlug(problemId);

    // Evaluate sample or dynamic test cases
    const testCases = (Array.isArray(reqTestCases) && reqTestCases.length > 0)
      ? reqTestCases
      : (DEFAULT_TEST_CASES[slug] || [
          { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
          { input: '[3,2,4]\n6', expectedOutput: '[1,2]' }
        ]);

    let result;

    // Handle empty code submission as evaluated zero-pass
    if (typeof code === 'string' && code.trim() === '') {
      result = {
        success: false,
        status: 'Wrong Answer',
        runtime: '0 ms',
        runtimeMs: 0,
        memory: '0 MB',
        memoryMb: 0,
        passedCases: 0,
        totalCases: testCases.length,
        error: 'No code submitted. Function body is empty.',
        testResults: testCases.map((tc, idx) => ({
          testCaseIndex: idx + 1,
          status: 'Failed',
          runtimeMs: 0,
          input: tc.input || '',
          expectedOutput: tc.expectedOutput || '',
          actualOutput: '(Empty code submission)'
        }))
      };
    } else if (customInput !== undefined && customInput !== null && customInput.trim() !== '') {
      result = await compilerService.runCode({
        language: language || 'javascript',
        code,
        customInput,
        problemSlug: slug
      });
    } else {
      result = await compilerService.evaluateTestCases({
        language: language || 'javascript',
        code,
        problemSlug: slug,
        testCases
      });
    }

    // Persist run execution and testcases to MongoDB Atlas history (like LeetCode)
    const userEmail = (studentEmail || req.user?.email || 'guest@techprepai.com').toLowerCase();
    let submission = null;
    try {
      submission = await DsaSubmission.create({
        studentEmail: userEmail,
        problemId: slug,
        problemTitle: problemTitle || (problemId ? problemId.replace(/^p_/, '').replace(/_/g, ' ') : 'Coding Challenge'),
        language: language || 'javascript',
        code,
        status: result.status || (result.passedCases === result.totalCases ? 'Accepted' : 'Wrong Answer'),
        actionType: 'run',
        source: source || 'ide',
        runtime: result.runtime || `${result.runtimeMs || 0} ms`,
        runtimeMs: result.runtimeMs || 0,
        memory: `${result.memoryMb || '40.0'} MB`,
        memoryMb: parseFloat(result.memoryMb) || 40.0,
        passedCases: result.passedCases !== undefined ? result.passedCases : (result.success ? testCases.length : 0),
        totalCases: result.totalCases !== undefined ? result.totalCases : testCases.length,
        testResults: result.testResults || [],
        quizContext: quizContext || undefined
      });
    } catch (saveErr) {
      console.warn('Could not persist run to DsaSubmission:', saveErr.message);
    }

    res.status(200).json({ success: true, result, submission });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit DSA solution
// @route   POST /api/dsa/submit
// @access  Public
exports.submitSolution = async (req, res, next) => {
  try {
    const { studentEmail, problemId, language, code, testCases: reqTestCases, source, quizContext, problemTitle } = req.body;

    if (!problemId || code === undefined || code === null) {
      return res.status(400).json({ success: false, message: 'Missing problem or code' });
    }

    const slug = normalizeSlug(problemId);
    const testCases = (Array.isArray(reqTestCases) && reqTestCases.length > 0)
      ? reqTestCases
      : (DEFAULT_TEST_CASES[slug] || [
          { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
          { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
          { input: '[3,3]\n6', expectedOutput: '[0,1]' }
        ]);

    let evaluation;
    if (typeof code === 'string' && code.trim() === '') {
      evaluation = {
        success: false,
        status: 'Wrong Answer',
        runtime: '0 ms',
        runtimeMs: 0,
        memory: '0 MB',
        memoryMb: 0,
        passedCases: 0,
        totalCases: testCases.length,
        error: 'Empty code submission',
        testResults: testCases.map((tc, idx) => ({
          testCaseIndex: idx + 1,
          status: 'Failed',
          runtimeMs: 0,
          input: tc.input || '',
          expectedOutput: tc.expectedOutput || '',
          actualOutput: '(Empty code submission)'
        }))
      };
    } else {
      evaluation = await compilerService.evaluateTestCases({
        language: language || 'javascript',
        code,
        problemSlug: slug,
        testCases
      });
    }

    const userEmail = (studentEmail || req.user?.email || 'guest@techprepai.com').toLowerCase();
    const submission = await DsaSubmission.create({
      studentEmail: userEmail,
      problemId: slug,
      problemTitle: problemTitle || (problemId ? problemId.replace(/^p_/, '').replace(/_/g, ' ') : 'Coding Challenge'),
      language: language || 'javascript',
      code,
      status: evaluation.status || 'Accepted',
      actionType: 'submit',
      source: source || 'ide',
      runtime: evaluation.runtime || '0 ms',
      runtimeMs: evaluation.runtimeMs || 0,
      memory: `${evaluation.memoryMb || '40.0'} MB`,
      memoryMb: parseFloat(evaluation.memoryMb) || 40.0,
      passedCases: evaluation.passedCases !== undefined ? evaluation.passedCases : testCases.length,
      totalCases: testCases.length,
      testResults: evaluation.testResults || [],
      quizContext: quizContext || undefined
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
    const { problemId, source, actionType, quizId, questionIdx } = req.query;

    const query = { studentEmail: email.toLowerCase() };
    if (problemId) {
      const normalized = normalizeSlug(problemId);
      query.$or = [{ problemId: normalized }, { problemId: String(problemId).trim() }];
    }
    if (source) query.source = source;
    if (actionType) query.actionType = actionType;
    if (quizId) query['quizContext.quizId'] = quizId;
    if (questionIdx !== undefined && questionIdx !== '') query['quizContext.questionIdx'] = Number(questionIdx);

    const submissions = await DsaSubmission.find(query).sort({ createdAt: -1 });

    const solvedProblemIds = [...new Set(submissions.filter(s => s.status === 'Accepted' && s.actionType === 'submit').map(s => s.problemId))];

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
