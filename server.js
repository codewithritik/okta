const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();
const swaggerDocs = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

swaggerDocs(app);


// Mount routes (includes /api/users and /health)
app.use('/', routes);


// Routes are mounted via routes/index.js

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Okta Users & Devices Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📚 API Docs: http://localhost:${PORT}`);
});

module.exports = app;