/**
 * Proctoring Security Telemetry Tracker
 */
class ProctoringTracker {
  constructor(onInfractionCallback, maxInfractions = 3) {
    this.infractionCount = 0;
    this.maxInfractions = maxInfractions;
    this.onInfraction = onInfractionCallback;
    this.events = [];
    this.init();
  }

  init() {
    window.addEventListener('blur', () => this.recordEvent('WINDOW_BLUR'));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.recordEvent('TAB_SWITCH_HIDDEN');
      }
    });
  }

  recordEvent(type) {
    this.infractionCount++;
    const record = { type, timestamp: new Date().toISOString(), count: this.infractionCount };
    this.events.push(record);
    if (this.onInfraction) {
      this.onInfraction(this.infractionCount, record);
    }
  }

  getSummary() {
    return {
      infractions: this.infractionCount,
      log: this.events,
      exceeded: this.infractionCount >= this.maxInfractions
    };
  }
}

window.ProctoringTracker = ProctoringTracker;
