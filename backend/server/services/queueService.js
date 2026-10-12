/**
 * Execution Queue Manager with Concurrency Throttling
 */
class ExecutionQueue {
  constructor(concurrency = 4) {
    this.concurrency = concurrency;
    this.runningCount = 0;
    this.queue = [];
  }

  enqueue(taskFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskFn, resolve, reject });
      this.processNext();
    });
  }

  async processNext() {
    if (this.runningCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.runningCount++;
    const { taskFn, resolve, reject } = this.queue.shift();

    try {
      const result = await taskFn();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this.runningCount--;
      this.processNext();
    }
  }

  getMetrics() {
    return {
      activeWorkers: this.runningCount,
      queuedJobs: this.queue.length,
      maxConcurrency: this.concurrency
    };
  }
}

module.exports = new ExecutionQueue(4);
