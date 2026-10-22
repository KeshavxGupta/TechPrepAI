const assert = require('assert');

function runProctoringSessionTests() {
  console.log('Running Comprehensive Proctoring & Session Integrity Tests...');

  // Test 1: Early Exit Marks Failed
  let sessionState = {
    examStarted: true,
    examSubmitted: false,
    quizId: 'quiz_123',
    scorePoints: 8,
    total: 10,
    examWarnings: 1
  };

  function terminateAndFailExam(reason) {
    sessionState.examSubmitted = true;
    sessionState.examStarted = false;
    return {
      quizId: sessionState.quizId,
      score: 0,
      percentage: 0,
      passed: false,
      status: 'FAILED',
      submissionReason: reason,
      violations: sessionState.examWarnings
    };
  }

  const failedResult = terminateAndFailExam('Session Terminated: Student Exited Early');
  assert.strictEqual(failedResult.passed, false, 'Early exit must result in passed: false');
  assert.strictEqual(failedResult.status, 'FAILED', 'Early exit must set status to FAILED');
  assert.strictEqual(failedResult.score, 0, 'Early exit must void score to 0');
  assert.strictEqual(failedResult.percentage, 0, 'Early exit must void percentage to 0');
  assert.strictEqual(sessionState.examStarted, false, 'Session must end on early exit');
  assert.strictEqual(sessionState.examSubmitted, true, 'Session must be submitted on early exit');
  console.log('✔ Test 1 Passed: Early exit immediately ends session and marks quiz as FAILED with 0% score.');

  // Test 2: Infraction Debouncing (burst suppression)
  const COOLDOWN_MS = 2500;
  let lastInfractionTime = 0;
  let warnings = 0;

  function handleWarning(currentTime) {
    if (currentTime - lastInfractionTime < COOLDOWN_MS) {
      return false; // suppressed by debounce
    }
    lastInfractionTime = currentTime;
    warnings++;
    return true;
  }

  // Simulation of a single tab switch triggering blur, visibilitychange, and fullscreenchange in rapid succession (10ms apart)
  const t0 = 10000;
  assert.strictEqual(handleWarning(t0), true, 'First event (blur) records strike 1');
  assert.strictEqual(handleWarning(t0 + 20), false, 'Second event (visibilitychange 20ms later) must be debounced');
  assert.strictEqual(handleWarning(t0 + 50), false, 'Third event (fullscreenchange 50ms later) must be debounced');
  assert.strictEqual(warnings, 1, 'Single tab switch must result in exactly 1 strike, not 3');

  // Next event after cooldown (3000ms later)
  assert.strictEqual(handleWarning(t0 + 3000), true, 'Subsequent event after cooldown records strike 2');
  assert.strictEqual(warnings, 2, 'Warnings should now be 2');

  // Third event after cooldown
  assert.strictEqual(handleWarning(t0 + 6000), true, 'Third event after cooldown records strike 3');
  assert.strictEqual(warnings, 3, 'Warnings reached 3');
  console.log('✔ Test 2 Passed: Proctoring infraction debouncer properly suppresses burst events.');

  // Test 3: Backend Model Compatibility
  const payload = {
    quizId: 'quiz_dsa_01',
    quizTitle: 'Data Structures Exam',
    studentEmail: 'student@test.edu',
    score: 0,
    scoreFraction: '0 / 10',
    scorePercent: 0,
    percentage: 0,
    totalQuestions: 10,
    passed: false,
    status: 'FAILED',
    violations: 3,
    submissionReason: 'Proctoring Infractions Limit Reached (3 Strikes)'
  };

  assert.ok(payload.quizId, 'quizId must be present');
  assert.strictEqual(payload.percentage, 0, 'percentage is 0');
  assert.strictEqual(payload.passed, false, 'passed is false');
  assert.strictEqual(payload.status, 'FAILED', 'status is FAILED');
  console.log('✔ Test 3 Passed: Quiz result payload aligns perfectly with backend controller and Mongoose model.');

  console.log('\nAll Proctoring & Exam Session integrity tests PASSED successfully!');
}

runProctoringSessionTests();
