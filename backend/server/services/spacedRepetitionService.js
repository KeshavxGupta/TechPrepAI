/**
 * SuperMemo SM-2 Spaced Repetition Algorithm for DSA Revision
 */
function calculateNextReview(quality, repetitions = 0, previousInterval = 1, easeFactor = 2.5) {
  // Quality: 0-5 rating of difficulty
  let newRepetitions = repetitions;
  let newInterval = previousInterval;
  let newEaseFactor = easeFactor;

  if (quality >= 3) {
    if (newRepetitions === 0) {
      newInterval = 1;
    } else if (newRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(previousInterval * easeFactor);
    }
    newRepetitions++;
  } else {
    newRepetitions = 0;
    newInterval = 1;
  }

  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    repetitions: newRepetitions,
    intervalDays: newInterval,
    easeFactor: parseFloat(newEaseFactor.toFixed(2)),
    nextReviewDate: nextReviewDate.toISOString().split('T')[0]
  };
}

module.exports = { calculateNextReview };
