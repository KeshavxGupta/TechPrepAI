const assert = require('assert');
const { parseInputArguments } = require('../server/services/drivers/inputParser');

function testInputParser() {
  console.log('Testing Universal Input Parser...');

  // Case 1: Comma separated arguments
  const res1 = parseInputArguments('[2, 7, 11, 15], 9');
  assert.strictEqual(res1.length, 2);
  assert.deepStrictEqual(res1[0], [2, 7, 11, 15]);
  assert.strictEqual(res1[1], 9);

  // Case 2: Multi-line string arguments
  const res2 = parseInputArguments('"anagram"\n"nagaram"');
  assert.strictEqual(res2.length, 2);
  assert.strictEqual(res2[0], 'anagram');
  assert.strictEqual(res2[1], 'nagaram');

  // Case 3: Quoted single argument
  const res3 = parseInputArguments('"A man, a plan, a canal: Panama"');
  assert.strictEqual(res3.length, 1);
  assert.strictEqual(res3[0], 'A man, a plan, a canal: Panama');

  console.log('All input parser tests passed!');
}

if (require.main === module) {
  testInputParser();
}

module.exports = { testInputParser };
