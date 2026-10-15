const assert = require('assert');
const { calculateMatchScore } = require('../server/services/atsKeywordService');

function testAtsScanner() {
  console.log('Testing ATS Keyword Scanner...');

  const resume = "Experienced SDE with expertise in React, Node.js, Express, MongoDB, Docker and Git.";
  const job = "Looking for engineer skilled in React, Node.js, Python, AWS, Docker and Kubernetes.";

  const result = calculateMatchScore(resume, job);
  assert(result.score > 0, 'Score should be positive');
  assert(result.matching.includes('react'));
  assert(result.missing.includes('aws'));

  console.log('ATS Scanner tests passed!');
}

if (require.main === module) {
  testAtsScanner();
}

module.exports = { testAtsScanner };
