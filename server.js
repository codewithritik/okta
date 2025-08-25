const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


// Health check endpoint with Okta connectivity check
app.get('/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Okta Users & Devices Service',
    checks: {
      server: 'OK',
      okta: 'CHECKING...'
    }
  };

  try {
    // Test Okta API connectivity
    const OktaService = require('./services/oktaService');
    const oktaService = new OktaService();
    
    // Try to fetch a small number of users to test connectivity
    await oktaService.axiosInstance.get('/users?limit=1');
    
    healthCheck.checks.okta = 'OK';
    healthCheck.message = 'All systems operational';
    
    res.status(200).json(healthCheck);
    
  } catch (error) {
    healthCheck.status = 'DEGRADED';
    healthCheck.checks.okta = 'FAILED';
    healthCheck.message = 'Okta API connection failed';
    healthCheck.error = {
      type: error.response?.status === 401 ? 'AUTHENTICATION_ERROR' : 'CONNECTION_ERROR',
      details: error.response?.data?.errorSummary || error.message
    };
    
    console.error('Health check - Okta API error:', error.message);
    res.status(503).json(healthCheck);
  }
});


// Routes
app.use('/api/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.get("/", (req, res) => {
  res.send("Hello from Render 🚀");
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
});

module.exports = app;