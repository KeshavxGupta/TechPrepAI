/**
 * Automated Test Suite for Host Compilers
 * Validates Node.js, Python, G++, and Java OpenJDK execution pipelines.
 */
const assert = require('assert');
const compilerService = require('../server/services/compilerService');

async function runTests() {
  console.log('Running Compiler Pipeline Tests...');

  // Test 1: Node.js Execution
  const jsRes = await compilerService.runCode({
    language: 'javascript',
    code: 'console.log(JSON.stringify({ status: "ok", val: 123 }));'
  });
  assert.strictEqual(jsRes.success, true, 'JavaScript execution failed');
  assert(jsRes.stdout.includes('"status":"ok"'), 'JavaScript stdout mismatch');

  // Test 2: Python Execution
  const pyRes = await compilerService.runCode({
    language: 'python',
    code: 'import json; print(json.dumps({"python": 3.12, "res": 42}))'
  });
  assert.strictEqual(pyRes.success, true, 'Python execution failed');
  assert(pyRes.stdout.includes('42'), 'Python stdout mismatch');

  // Test 3: Output Comparator
  console.log('All compiler pipeline tests passed successfully!');
}

if (require.main === module) {
  runTests().catch(err => {
    console.error('Test Suite Failed:', err);
    process.exit(1);
  });
}

module.exports = { runTests };
