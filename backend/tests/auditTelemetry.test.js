const assert = require('assert');

function testProctoringRules() {
  console.log('Testing Proctoring Rules & Infraction Thresholds...');
  const maxAllowed = 3;
  let infractionCount = 0;

  function onBlur() {
    infractionCount++;
    return infractionCount >= maxAllowed;
  }

  assert.strictEqual(onBlur(), false);
  assert.strictEqual(onBlur(), false);
  assert.strictEqual(onBlur(), true, 'Auto-submit should trigger on 3rd violation');

  console.log('Proctoring rules tests passed!');
}

if (require.main === module) {
  testProctoringRules();
}

module.exports = { testProctoringRules };
