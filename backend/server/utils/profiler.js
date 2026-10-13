/**
 * High-Resolution Microsecond Profiler & Memory Tracker
 */
class ExecutionProfiler {
  constructor(label = 'Profile') {
    this.label = label;
    this.startHr = process.hrtime.bigint();
    this.startMem = process.memoryUsage();
  }

  stop() {
    const endHr = process.hrtime.bigint();
    const endMem = process.memoryUsage();

    const durationNanos = Number(endHr - this.startHr);
    const durationMs = (durationNanos / 1e6).toFixed(2);
    const memoryDiffRssMb = ((endMem.rss - this.startMem.rss) / (1024 * 1024)).toFixed(2);

    return {
      label: this.label,
      durationMs: parseFloat(durationMs),
      memoryRssDiffMb: parseFloat(memoryDiffRssMb),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ExecutionProfiler;
