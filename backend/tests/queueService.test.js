const assert = require('assert');
const queue = require('../server/services/queueService');

async function testQueue() {
  console.log('Testing Execution Queue...');

  const completed = [];
  const tasks = [1, 2, 3, 4, 5].map(id => 
    queue.enqueue(async () => {
      await new Promise(r => setTimeout(r, 20));
      completed.push(id);
      return id;
    })
  );

  await Promise.all(tasks);
  assert.strictEqual(completed.length, 5);
  console.log('Execution queue tests passed!');
}

if (require.main === module) {
  testQueue().catch(console.error);
}

module.exports = { testQueue };
