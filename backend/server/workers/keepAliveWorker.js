const mongoose = require('mongoose');
const { performance } = require('perf_hooks');
const connectDB = require('../config/db');

// In-memory keep-alive metrics
const stats = {
  isRunning: false,
  intervalMs: 240000, // 4 minutes by default
  totalPings: 0,
  successfulPings: 0,
  failedPings: 0,
  lastPingTime: null,
  lastLatencyMs: null,
  averageLatencyMs: 0,
  lastError: null,
  startedAt: null
};

let timerId = null;

/**
 * Perform a single heartbeat ping directly against MongoDB Atlas
 * 1. Verifies/establishes connection
 * 2. Runs admin.ping() command
 * 3. Writes a heartbeat record to 'keepalives' collection to maintain active Atlas I/O
 */
async function pingDatabase() {
  const startTime = performance.now();
  stats.totalPings++;

  try {
    // 1. Ensure active database connection
    await connectDB();

    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      throw new Error(`MongoDB connection readyState is ${mongoose.connection ? mongoose.connection.readyState : 'null'}`);
    }

    // 2. Execute low-level admin ping
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();

    // 3. Upsert a heartbeat document into 'keepalives' collection
    // This generates actual read/write I/O on MongoDB Atlas, ensuring M0/serverless clusters never idle or pause
    const keepaliveColl = mongoose.connection.db.collection('keepalives');
    const updateRes = await keepaliveColl.updateOne(
      { _id: 'atlas_heartbeat' },
      {
        $set: {
          service: 'TechPrepAI',
          status: 'active',
          environment: process.env.NODE_ENV || 'production',
          host: mongoose.connection.host,
          databaseName: mongoose.connection.name,
          lastHeartbeat: new Date(),
          updatedAt: new Date()
        },
        $inc: { totalHeartbeats: 1 }
      },
      { upsert: true }
    );

    const latencyMs = Math.round(performance.now() - startTime);

    stats.successfulPings++;
    stats.lastPingTime = new Date().toISOString();
    stats.lastLatencyMs = latencyMs;
    stats.lastError = null;

    // Moving average of latency
    stats.averageLatencyMs = stats.averageLatencyMs === 0
      ? latencyMs
      : Math.round((stats.averageLatencyMs * 0.8) + (latencyMs * 0.2));

    return {
      success: true,
      message: 'MongoDB Atlas keep-alive heartbeat acknowledged. Cluster is active and awake.',
      clusterState: 'active',
      latencyMs,
      averageLatencyMs: stats.averageLatencyMs,
      totalPings: stats.totalPings,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      timestamp: stats.lastPingTime
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startTime);
    stats.failedPings++;
    stats.lastError = error.message;
    stats.lastPingTime = new Date().toISOString();
    console.error(`[Mongo Keep-Alive Worker Error]: ${error.message}`);

    return {
      success: false,
      message: 'MongoDB Atlas heartbeat ping failed',
      clusterState: 'reconnecting',
      latencyMs,
      error: error.message,
      timestamp: stats.lastPingTime
    };
  }
}

/**
 * Start the background keep-alive loop
 * @param {number} intervalMs - Frequency in milliseconds (default: 4 minutes = 240,000ms)
 */
function startKeepAliveWorker(intervalMs = 240000) {
  if (stats.isRunning) {
    console.log('[Mongo Keep-Alive Worker] Already running.');
    return;
  }

  stats.intervalMs = intervalMs;
  stats.isRunning = true;
  stats.startedAt = new Date().toISOString();

  console.log(`[Mongo Keep-Alive Worker] Started. Heartbeat interval: ${intervalMs / 1000}s`);

  // Initial immediate ping
  pingDatabase().then(res => {
    if (res.success) {
      console.log(`[Mongo Keep-Alive Worker] Initial ping successful (${res.latencyMs} ms) on ${res.database}`);
    }
  }).catch(err => {
    console.warn(`[Mongo Keep-Alive Worker] Initial ping warning:`, err.message);
  });

  // Recurring timer
  timerId = setInterval(async () => {
    const res = await pingDatabase();
    if (res.success) {
      console.log(`[Mongo Keep-Alive Worker Heartbeat]: Cluster ACTIVE (${res.latencyMs}ms) at ${res.timestamp}`);
    } else {
      console.warn(`[Mongo Keep-Alive Worker Heartbeat FAILED]: ${res.error}`);
    }
  }, intervalMs);

  // Do not prevent process from exiting if it is the only remaining handle
  if (timerId && typeof timerId.unref === 'function') {
    timerId.unref();
  }
}

/**
 * Stop the background keep-alive loop
 */
function stopKeepAliveWorker() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  stats.isRunning = false;
  console.log('[Mongo Keep-Alive Worker] Stopped.');
}

/**
 * Get current keep-alive stats
 */
function getKeepAliveStats() {
  return {
    ...stats,
    dbConnectionState: mongoose.connection ? mongoose.connection.readyState : 0,
    dbHost: mongoose.connection ? mongoose.connection.host : null,
    dbName: mongoose.connection ? mongoose.connection.name : null
  };
}

module.exports = {
  pingDatabase,
  startKeepAliveWorker,
  stopKeepAliveWorker,
  getKeepAliveStats
};
