require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./server/config/db');
const errorHandler = require('./server/middleware/errorHandler');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging in Development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// REST API Routes
app.use('/api/auth', require('./server/routes/authRoutes'));
app.use('/api/quizzes', require('./server/routes/quizRoutes'));
app.use('/api/placements', require('./server/routes/placementRoutes'));
app.use('/api/resumes', require('./server/routes/resumeRoutes'));
app.use('/api/dsa', require('./server/routes/dsaRoutes'));
app.use('/api/planner', require('./server/routes/plannerRoutes'));
app.use('/api/admin', require('./server/routes/adminRoutes'));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    app: 'TechPrep AI',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Static Frontend Hosting (Serving HTML, CSS, JS, Pages directly)
app.use(express.static(path.join(__dirname, '.')));

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found` });
});

// Fallback to 404.html for web pages
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Central Error Handling Middleware
app.use(errorHandler);

// Start HTTP Server
const PORT = process.env.PORT || 5000;
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
