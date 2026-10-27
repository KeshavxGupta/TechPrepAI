/**
 * Comprehensive API Endpoint Verification Suite
 * Tests all REST API endpoints across:
 * - Health & System
 * - Authentication & User Management
 * - Quizzes & Assessments
 * - Placement Drives & Tracking
 * - Resumes & ATS Scanner
 * - DSA Problems & Code Execution Engine
 * - Study Planner Tasks
 * - Admin Telemetry
 * - 404 Route Fallback
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

let BASE_URL = process.env.TEST_URL || `http://localhost:${process.env.PORT || 5000}`;
let serverInstance = null;

const results = [];
let passed = 0;
let failed = 0;

async function request(method, path, body = null, headers = {}) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = JSON.stringify(body);
  }

  const startTime = Date.now();
  try {
    const res = await fetch(url, options);
    const durationMs = Date.now() - startTime;
    let data = null;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      status: res.status,
      ok: res.ok,
      durationMs,
      data
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;
    return {
      status: 0,
      ok: false,
      durationMs,
      error: error.message
    };
  }
}

function recordResult(name, method, endpoint, expectedStatus, actualRes, extraAssertion = true) {
  const isMatch = Array.isArray(expectedStatus)
    ? expectedStatus.includes(actualRes.status)
    : actualRes.status === expectedStatus;

  const success = isMatch && extraAssertion;

  if (success) {
    passed++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m [${method}] ${endpoint} -> ${actualRes.status} (${actualRes.durationMs}ms)`);
  } else {
    failed++;
    console.error(`  \x1b[31m✖ FAIL\x1b[0m [${method}] ${endpoint} -> Expected ${JSON.stringify(expectedStatus)}, got ${actualRes.status} (${actualRes.durationMs}ms)`);
    if (actualRes.data) {
      console.error('    Response:', JSON.stringify(actualRes.data).substring(0, 150));
    }
    if (actualRes.error) {
      console.error('    Error:', actualRes.error);
    }
  }

  results.push({
    name,
    method,
    endpoint,
    expectedStatus,
    actualStatus: actualRes.status,
    durationMs: actualRes.durationMs,
    success
  });
}

async function runTests() {
  // Auto-detect or launch server if not currently running
  try {
    const ping = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(1000) });
    if (!ping.ok) throw new Error('Not running');
  } catch {
    process.env.VERCEL = '1';
    const app = require('../server');
    await new Promise((resolve) => {
      serverInstance = app.listen(0, () => {
        const port = serverInstance.address().port;
        BASE_URL = `http://localhost:${port}`;
        resolve();
      });
    });
  }

  console.log('====================================================');
  console.log(` TechPrep AI - Automated API Endpoint Test Suite`);
  console.log(` Target Server: ${BASE_URL}`);
  console.log(` Timestamp:     ${new Date().toISOString()}`);
  console.log('====================================================\n');

  const testSuffix = Date.now();
  const testEmail = `test_runner_${testSuffix}@techprepai.test`;
  const testPassword = 'TestPassword123!';
  let createdUserId = null;
  let testQuizCustomId = `test_quiz_${testSuffix}`;
  let testDriveCustomId = `test_drive_${testSuffix}`;
  let testResumeId = null;
  let testTaskId = null;

  // --------------------------------------------------
  // 1. Health & System Check
  // --------------------------------------------------
  console.log('\x1b[36m[Group 1: Health & System Diagnostics]\x1b[0m');
  const healthRes = await request('GET', '/api/health');
  recordResult('Health Check API', 'GET', '/api/health', 200, healthRes, healthRes.data?.status === 'OK');

  // --------------------------------------------------
  // 2. Authentication & User Management
  // --------------------------------------------------
  console.log('\n\x1b[36m[Group 2: Authentication & User Management]\x1b[0m');
  
  // Register
  const registerRes = await request('POST', '/api/auth/register', {
    name: 'Automated Test Runner',
    email: testEmail,
    password: testPassword,
    college: 'TechPrep Academy',
    degree: 'B.Tech',
    branch: 'Computer Science',
    cgpa: '9.5'
  });
  recordResult('Register User', 'POST', '/api/auth/register', 201, registerRes, registerRes.data?.success === true);
  if (registerRes.data?.user?.id) {
    createdUserId = registerRes.data.user.id;
  }

  // Login
  const loginRes = await request('POST', '/api/auth/login', {
    email: testEmail,
    password: testPassword
  });
  recordResult('Login User', 'POST', '/api/auth/login', 200, loginRes, Boolean(loginRes.data?.token));

  // Get Profile (GET /api/auth/me)
  const getMeRes = await request('GET', `/api/auth/me?email=${encodeURIComponent(testEmail)}`);
  recordResult('Get Current Profile', 'GET', `/api/auth/me?email=...`, 200, getMeRes, getMeRes.data?.user?.email === testEmail);

  // Update Profile (PUT /api/auth/profile)
  const updateProfileRes = await request('PUT', '/api/auth/profile', {
    email: testEmail,
    skills: 'JavaScript, Python, Docker, React',
    linkedin: 'https://linkedin.com/in/testrunner'
  });
  recordResult('Update User Profile', 'PUT', '/api/auth/profile', 200, updateProfileRes, updateProfileRes.data?.success === true);

  // Get All Users (GET /api/auth/users)
  const allUsersRes = await request('GET', '/api/auth/users');
  recordResult('Get All Users (Admin)', 'GET', '/api/auth/users', 200, allUsersRes, Array.isArray(allUsersRes.data?.users));

  // Toggle Suspend (PUT /api/auth/users/:id/toggle-suspend)
  const toggleSuspendRes = await request('PUT', `/api/auth/users/${createdUserId || testEmail}/toggle-suspend`);
  recordResult('Toggle Suspend User', 'PUT', `/api/auth/users/:id/toggle-suspend`, 200, toggleSuspendRes, toggleSuspendRes.data?.success === true);

  // Reset Password (PUT /api/auth/users/:id/reset-password)
  const resetPassRes = await request('PUT', `/api/auth/users/${createdUserId || testEmail}/reset-password`, {
    newPassword: 'UpdatedPassword456!'
  });
  recordResult('Reset User Password', 'PUT', `/api/auth/users/:id/reset-password`, 200, resetPassRes, resetPassRes.data?.success === true);

  // --------------------------------------------------
  // 3. Quizzes & Assessment System
  // --------------------------------------------------
  console.log('\n\x1b[36m[Group 3: Quizzes & Assessments]\x1b[0m');

  // List all quizzes (GET /api/quizzes)
  const listQuizzesRes = await request('GET', '/api/quizzes');
  recordResult('List All Quizzes', 'GET', '/api/quizzes', 200, listQuizzesRes, Array.isArray(listQuizzesRes.data?.quizzes));

  // Create Quiz (POST /api/quizzes)
  const saveQuizRes = await request('POST', '/api/quizzes', {
    customId: testQuizCustomId,
    title: 'API Automated Test Quiz',
    description: 'Dynamic verification quiz created by test runner',
    timeLimit: 10,
    passPercentage: 70,
    category: 'Testing & QA',
    questions: [
      {
        text: 'What is HTTP status 200?',
        options: ['Created', 'OK', 'Not Found', 'Bad Request'],
        correctIndex: 1,
        explanation: '200 indicates standard successful HTTP response.'
      }
    ]
  });
  recordResult('Create/Save Quiz', 'POST', '/api/quizzes', [200, 201], saveQuizRes, saveQuizRes.data?.success === true);

  // Get Quiz by ID (GET /api/quizzes/:id)
  const getQuizRes = await request('GET', `/api/quizzes/${testQuizCustomId}`);
  recordResult('Get Quiz by ID', 'GET', `/api/quizzes/:id`, 200, getQuizRes, getQuizRes.data?.quiz?.customId === testQuizCustomId);

  // Submit Quiz Result (POST /api/quizzes/results)
  const submitQuizResultRes = await request('POST', '/api/quizzes/results', {
    studentEmail: testEmail,
    studentName: 'Automated Test Runner',
    quizId: testQuizCustomId,
    quizTitle: 'API Automated Test Quiz',
    score: 1,
    totalQuestions: 1,
    percentage: 100,
    passed: true,
    timeSpentSeconds: 45,
    userAnswers: [{ questionIndex: 0, selectedIndex: 1, isCorrect: true }]
  });
  recordResult('Submit Quiz Attempt', 'POST', '/api/quizzes/results', 201, submitQuizResultRes, submitQuizResultRes.data?.success === true);

  // Get All Results (GET /api/quizzes/results)
  const allResultsRes = await request('GET', '/api/quizzes/results');
  recordResult('Get All Quiz Results', 'GET', '/api/quizzes/results', 200, allResultsRes, Array.isArray(allResultsRes.data?.results));

  // Get Student Results (GET /api/quizzes/results/user/:email)
  const studentResultsRes = await request('GET', `/api/quizzes/results/user/${encodeURIComponent(testEmail)}`);
  recordResult('Get Student Quiz Results', 'GET', `/api/quizzes/results/user/:email`, 200, studentResultsRes, Array.isArray(studentResultsRes.data?.results));

  // Delete Quiz (DELETE /api/quizzes/:id)
  const deleteQuizRes = await request('DELETE', `/api/quizzes/${testQuizCustomId}`);
  recordResult('Delete Quiz', 'DELETE', `/api/quizzes/:id`, 200, deleteQuizRes, deleteQuizRes.data?.success === true);

  // --------------------------------------------------
  // 4. Placement Drives & Tracking
  // --------------------------------------------------
  console.log('\n\x1b[36m[Group 4: Placement Drives & Opportunities]\x1b[0m');

  // List Placements (GET /api/placements)
  const listPlacementsRes = await request('GET', '/api/placements');
  recordResult('List Placements', 'GET', '/api/placements', 200, listPlacementsRes, Array.isArray(listPlacementsRes.data?.placements));

  // Create Placement (POST /api/placements)
  const createDriveRes = await request('POST', '/api/placements', {
    customId: testDriveCustomId,
    company: 'Anthropic Labs Testing',
    role: 'Staff Systems Engineer',
    package: '42.0',
    deadline: '2026-11-30',
    interviewDate: '2026-12-10',
    eligibility: '8.5+ CGPA',
    location: 'San Francisco, CA / Remote',
    status: 'wishlist',
    studentEmail: testEmail
  });
  recordResult('Create Placement Drive', 'POST', '/api/placements', 201, createDriveRes, createDriveRes.data?.success === true);

  // Get User Placements (GET /api/placements/user/:email)
  const userPlacementsRes = await request('GET', `/api/placements/user/${encodeURIComponent(testEmail)}`);
  recordResult('Get User Placements', 'GET', `/api/placements/user/:email`, 200, userPlacementsRes, Array.isArray(userPlacementsRes.data?.placements));

  // Update Placement (PUT /api/placements/:id)
  const updateDriveRes = await request('PUT', `/api/placements/${testDriveCustomId}`, {
    notes: 'Preparing distributed systems and caching patterns.'
  });
  recordResult('Update Placement Drive', 'PUT', `/api/placements/:id`, 200, updateDriveRes, updateDriveRes.data?.success === true);

  // Update Placement Status (PATCH /api/placements/:id/status)
  const updateStatusRes = await request('PATCH', `/api/placements/${testDriveCustomId}/status`, {
    status: 'applied',
    studentEmail: testEmail
  });
  recordResult('Update Placement Status', 'PATCH', `/api/placements/:id/status`, 200, updateStatusRes, updateStatusRes.data?.success === true);

  // Sync User Placements (POST /api/placements/sync)
  const syncPlacementsRes = await request('POST', '/api/placements/sync', {
    email: testEmail,
    placements: [
      {
        customId: testDriveCustomId,
        company: 'Anthropic Labs Testing',
        role: 'Staff Systems Engineer',
        package: '42.0',
        status: 'applied'
      }
    ]
  });
  recordResult('Sync User Placements', 'POST', '/api/placements/sync', 200, syncPlacementsRes, Array.isArray(syncPlacementsRes.data?.placements));

  // Delete Placement (DELETE /api/placements/:id)
  const deletePlacementRes = await request('DELETE', `/api/placements/${testDriveCustomId}`);
  recordResult('Delete Placement Drive', 'DELETE', `/api/placements/:id`, 200, deletePlacementRes, deletePlacementRes.data?.success === true);

  // --------------------------------------------------
  // 5. Resumes & ATS Scanner
  // --------------------------------------------------
  console.log('\n\x1b[36m[Group 5: Resumes & ATS Scoring Engine]\x1b[0m');

  // Create Resume (POST /api/resumes)
  const createResumeRes = await request('POST', '/api/resumes', {
    studentEmail: testEmail,
    title: 'Full Stack Engineer Resume',
    template: 'modern',
    personalInfo: {
      fullName: 'Automated Test Runner',
      email: testEmail,
      phone: '+91 9876543210'
    },
    summary: 'Experienced Full Stack developer proficient in JavaScript, Node.js, and MongoDB.',
    skills: {
      languages: ['JavaScript', 'Python'],
      frameworks: ['Express', 'React'],
      developerTools: ['Git', 'Docker'],
      coreConcepts: ['Data Structures', 'REST APIs']
    }
  });
  recordResult('Save/Create Resume', 'POST', '/api/resumes', 201, createResumeRes, createResumeRes.data?.success === true);
  if (createResumeRes.data?.resume?._id) {
    testResumeId = createResumeRes.data.resume._id;
  }

  // Get User Resumes (GET /api/resumes/user/:email)
  const getUserResumesRes = await request('GET', `/api/resumes/user/${encodeURIComponent(testEmail)}`);
  recordResult('Get User Resumes', 'GET', `/api/resumes/user/:email`, 200, getUserResumesRes, Array.isArray(getUserResumesRes.data?.resumes));

  // Get Resume by ID (GET /api/resumes/:id)
  if (testResumeId) {
    const getResumeByIdRes = await request('GET', `/api/resumes/${testResumeId}`);
    recordResult('Get Resume by ID', 'GET', `/api/resumes/:id`, 200, getResumeByIdRes, Boolean(getResumeByIdRes.data?.resume));
  }

  // ATS Scanner (POST /api/resumes/scan-ats)
  const scanAtsRes = await request('POST', '/api/resumes/scan-ats', {
    resumeText: 'Passionate software engineer skilled in javascript, python, react, node.js, express, mongodb, sql, and dsa algorithms.',
    targetRole: 'Full Stack Engineer'
  });
  recordResult('Scan Resume ATS Score', 'POST', '/api/resumes/scan-ats', 200, scanAtsRes, typeof scanAtsRes.data?.analysis?.overallScore === 'number');

  // Delete Resume (DELETE /api/resumes/:id)
  if (testResumeId) {
    const deleteResumeRes = await request('DELETE', `/api/resumes/${testResumeId}`);
    recordResult('Delete Resume', 'DELETE', `/api/resumes/:id`, 200, deleteResumeRes, deleteResumeRes.data?.success === true);
  }

  // --------------------------------------------------
  // 6. DSA & Code Execution Engine
  // --------------------------------------------------
  console.log('\n\x1b[36m[Group 6: DSA & Code Execution Engine]\x1b[0m');

  // List DSA Problems (GET /api/dsa/problems)
  const listDsaRes = await request('GET', '/api/dsa/problems');
  recordResult('List DSA Problems', 'GET', '/api/dsa/problems', 200, listDsaRes, Array.isArray(listDsaRes.data?.problems));

  // Get DSA Problem by ProblemID (GET /api/dsa/problems/:problemId)
  const getProblemRes = await request('GET', '/api/dsa/problems/two-sum');
  recordResult('Get Problem by ID', 'GET', '/api/dsa/problems/:problemId', [200, 404], getProblemRes);

  // Run Code (POST /api/dsa/run)
  const runCodeRes = await request('POST', '/api/dsa/run', {
    problemId: 'two-sum',
    language: 'javascript',
    code: 'function twoSum(nums, target) { return [0, 1]; }',
    testCases: [{ input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' }]
  });
  recordResult('Execute / Run DSA Code', 'POST', '/api/dsa/run', 200, runCodeRes, runCodeRes.data?.success === true);

  // Submit Code Solution (POST /api/dsa/submit)
  const submitDsaRes = await request('POST', '/api/dsa/submit', {
    studentEmail: testEmail,
    problemId: 'two-sum',
    language: 'javascript',
    code: 'function twoSum(nums, target) { return [0, 1]; }'
  });
  recordResult('Submit DSA Solution', 'POST', '/api/dsa/submit', 201, submitDsaRes, submitDsaRes.data?.success === true);

  // Get User Submissions (GET /api/dsa/submissions/user/:email)
  const userSubmissionsRes = await request('GET', `/api/dsa/submissions/user/${encodeURIComponent(testEmail)}`);
  recordResult('Get User DSA Submissions', 'GET', `/api/dsa/submissions/user/:email`, 200, userSubmissionsRes, Array.isArray(userSubmissionsRes.data?.submissions));

  // --------------------------------------------------
  // 7. Planner Tasks
  // --------------------------------------------------
  console.log('\n\x1b[36m[Group 7: Study Planner Tasks]\x1b[0m');

  // Create Task (POST /api/planner/tasks)
  const createTaskRes = await request('POST', '/api/planner/tasks', {
    studentEmail: testEmail,
    title: 'Solve 5 DP questions',
    category: 'DSA Practice',
    priority: 'High',
    dueDate: '2026-10-30'
  });
  recordResult('Create Planner Task', 'POST', '/api/planner/tasks', 201, createTaskRes, createTaskRes.data?.success === true);
  if (createTaskRes.data?.task?._id) {
    testTaskId = createTaskRes.data.task._id;
  }

  // Get User Tasks (GET /api/planner/tasks/user/:email)
  const getUserTasksRes = await request('GET', `/api/planner/tasks/user/${encodeURIComponent(testEmail)}`);
  recordResult('Get User Planner Tasks', 'GET', `/api/planner/tasks/user/:email`, 200, getUserTasksRes, Array.isArray(getUserTasksRes.data?.tasks));

  // Toggle Task Completion (PATCH /api/planner/tasks/:id/toggle)
  if (testTaskId) {
    const toggleTaskRes = await request('PATCH', `/api/planner/tasks/${testTaskId}/toggle`);
    recordResult('Toggle Task Status', 'PATCH', `/api/planner/tasks/:id/toggle`, 200, toggleTaskRes, toggleTaskRes.data?.success === true);

    // Delete Task (DELETE /api/planner/tasks/:id)
    const deleteTaskRes = await request('DELETE', `/api/planner/tasks/${testTaskId}`);
    recordResult('Delete Planner Task', 'DELETE', `/api/planner/tasks/:id`, 200, deleteTaskRes, deleteTaskRes.data?.success === true);
  }

  // --------------------------------------------------
  // 8. Admin Telemetry
  // --------------------------------------------------
  console.log('\n\x1b[36m[Group 8: Admin Telemetry & Metrics]\x1b[0m');
  const telemetryRes = await request('GET', '/api/admin/telemetry');
  recordResult('Admin Telemetry Dashboard', 'GET', '/api/admin/telemetry', 200, telemetryRes, Boolean(telemetryRes.data?.telemetry?.users));

  // --------------------------------------------------
  // 9. Error Handling / 404 Route
  // --------------------------------------------------
  console.log('\n\x1b[36m[Group 9: Error Handling & 404 Fallback]\x1b[0m');
  const notFoundRes = await request('GET', '/api/nonexistent_test_route_404');
  recordResult('404 Undefined API Route', 'GET', '/api/nonexistent_test_route_404', 404, notFoundRes, notFoundRes.data?.success === false);

  // --------------------------------------------------
  // Clean-up Test Data in Database
  // --------------------------------------------------
  console.log('\n\x1b[33m[Cleaning up temporary test records...]\x1b[0m');
  try {
    const connectDB = require('../server/config/db');
    await connectDB();
    const User = require('../server/models/User');
    const QuizResult = require('../server/models/QuizResult');
    const DsaSubmission = require('../server/models/DsaSubmission');
    const PlannerTask = require('../server/models/PlannerTask');

    await User.deleteMany({ email: testEmail });
    await QuizResult.deleteMany({ studentEmail: testEmail });
    await DsaSubmission.deleteMany({ studentEmail: testEmail });
    await PlannerTask.deleteMany({ studentEmail: testEmail });
    console.log('  Cleaned up test artifacts for', testEmail);
    await mongoose.connection.close();
  } catch (err) {
    console.warn('  Cleanup notice:', err.message);
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
  }

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------
  console.log('\n====================================================');
  console.log(` API TEST SUITE EXECUTION SUMMARY`);
  console.log('====================================================');
  console.log(` Total Endpoints Tested: ${results.length}`);
  console.log(` Passed:                 \x1b[32m${passed}\x1b[0m`);
  console.log(` Failed:                 \x1b[${failed > 0 ? '31' : '32'}m${failed}\x1b[0m`);
  console.log(` Success Rate:           ${((passed / results.length) * 100).toFixed(1)}%`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
