#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { startKeepAliveWorker, getKeepAliveStats } = require('./keepAliveWorker');

console.log('====================================================');
console.log(' TechPrep AI - MongoDB Atlas Standalone Keep-Alive Worker');
console.log(' Ensuring Atlas cluster never sleeps or pauses');
console.log('====================================================');

// Run with 3-minute interval (180,000 ms) in standalone mode
const INTERVAL_MS = parseInt(process.env.KEEP_ALIVE_INTERVAL_MS, 10) || 180000;
startKeepAliveWorker(INTERVAL_MS);

// Handle graceful shutdown
const shutdown = () => {
  console.log('\n[Worker] Received termination signal. Shutting down gracefully...');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Status logging every 15 minutes
setInterval(() => {
  const stats = getKeepAliveStats();
  console.log(`[Worker Status] Total Pings: ${stats.totalPings} | Success: ${stats.successfulPings} | Avg Latency: ${stats.averageLatencyMs}ms`);
}, 900000);
