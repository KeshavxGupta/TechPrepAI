const assert = require('assert');
const { calculateNextReview } = require('../server/services/spacedRepetitionService');

function testSpacedRepetition() {
  console.log('Testing SM-2 Spaced Repetition...');

  const r1 = calculateNextReview(5, 0, 1, 2.5);
  assert.strictEqual(r1.repetitions, 1);
  assert.strictEqual(r1.intervalDays, 1);

  const r2 = calculateNextReview(5, 1, 1, r1.easeFactor);
  assert.strictEqual(r2.repetitions, 2);
  assert.strictEqual(r2.intervalDays, 6);

  console.log('Spaced repetition tests passed!');
}

if (require.main === module) {
  testSpacedRepetition();
}

module.exports = { testSpacedRepetition };
