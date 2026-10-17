/**
 * End-to-End Quiz Taking & Compilation Test Runner
 */
const assert = require('assert');
const compilerService = require('../server/services/compilerService');

async function testE2E() {
  console.log('Running End-to-End Integration Suite...');

  const submission = await compilerService.evaluateTestCases({
    language: 'javascript',
    code: 'function twoSum(nums, target) { return [0, 1]; }',
    problemSlug: 'two-sum',
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' }
    ]
  });

  assert.strictEqual(submission.status, 'Accepted');
  assert.strictEqual(submission.passedCases, 1);
  console.log('E2E integration test completed successfully!');
}

if (require.main === module) {
  testE2E().catch(console.error);
}

module.exports = { testE2E };
