const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./server/config/db');
const errorHandler = require('./server/middleware/errorHandler');

// Initialize Express App
const app = express();

// Initial DB connection attempt
connectDB().catch(err => console.warn('[MongoDB Initial Setup Warning]:', err.message));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging in Development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check API (immediate response, includes DB connection state)
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.status(200).json({
    status: 'OK',
    app: 'TechPrep AI',
    version: '1.0.0',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'connecting_or_disconnected',
    timestamp: new Date().toISOString()
  });
});

// Ensure database is connected before handling API routes (critical for Vercel serverless cold-starts)
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[API Serverless DB Connection Error]:', err.message);
    res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure MongoDB Atlas network access allows 0.0.0.0/0.',
      error: err.message
    });
  }
});

// REST API Routes
app.use('/api/auth', require('./server/routes/authRoutes'));
app.use('/api/quizzes', require('./server/routes/quizRoutes'));
app.use('/api/placements', require('./server/routes/placementRoutes'));
app.use('/api/resumes', require('./server/routes/resumeRoutes'));
app.use('/api/dsa', require('./server/routes/dsaRoutes'));
app.use('/api/planner', require('./server/routes/plannerRoutes'));
app.use('/api/admin', require('./server/routes/adminRoutes'));

// Static Frontend Hosting (Serving HTML, CSS, JS, Pages directly from frontend directory)
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found` });
});

// Fallback to 404.html for web pages
app.use((req, res) => {
  res.status(404).sendFile(path.join(frontendPath, '404.html'));
});

// Central Error Handling Middleware
app.use(errorHandler);

// Start HTTP Server (when running directly or in standalone dev/prod, not on Vercel serverless)
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` TechPrep AI MERN Server running on port ${PORT}`);
    console.log(` Web Frontend: http://localhost:${PORT}`);
    console.log(` REST API:     http://localhost:${PORT}/api/health`);
    console.log(` Mode:         ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`[Unhandled Server Rejection]: ${err.message}`);
  });
}

module.exports = app;
