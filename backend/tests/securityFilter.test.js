const assert = require('assert');
const { scanCodeForVulnerabilities } = require('../server/utils/securityFilter');

function testSecurityFilter() {
  console.log('Running Security Filter Tests...');

  // Test 1: Safe code passes
  const safeJs = 'function add(a, b) { return a + b; }';
  assert.strictEqual(scanCodeForVulnerabilities(safeJs, 'javascript').safe, true);

  // Test 2: Fork / subprocess prohibited
  const unsafePy = 'import os; os.system("rm -rf /")';
  assert.strictEqual(scanCodeForVulnerabilities(unsafePy, 'python').safe, false);

  // Test 3: C++ system call blocked
  const unsafeCpp = '#include <iostream>\nint main() { system("dir"); return 0; }';
  assert.strictEqual(scanCodeForVulnerabilities(unsafeCpp, 'cpp').safe, false);

  console.log('Security filter tests passed successfully!');
}

if (require.main === module) {
  testSecurityFilter();
}

module.exports = { testSecurityFilter };
