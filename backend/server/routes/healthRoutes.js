const express = require('express');
const router = express.Router();
const os = require('os');
const mongoose = require('mongoose');
const compilerConfig = require('../config/compilerConfig');

router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    success: true,
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    system: {
      platform: os.platform(),
      release: os.release(),
      cpuCount: os.cpus().length,
      freeMemoryMb: Math.round(os.freemem() / (1024 * 1024)),
      totalMemoryMb: Math.round(os.totalmem() / (1024 * 1024))
    },
    process: {
      heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
      rssMb: Math.round(memoryUsage.rss / (1024 * 1024))
    },
    database: {
      provider: 'MongoDB Atlas',
      status: dbStatus
    },
    compilers: Object.keys(compilerConfig.compilers).map(lang => ({
      language: lang,
      name: compilerConfig.compilers[lang].name,
      configured: Boolean(compilerConfig.compilers[lang].compilerPath || compilerConfig.compilers[lang].runnerPath)
    }))
  });
});

module.exports = router;
