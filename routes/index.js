const express = require('express');

const router = express.Router();

// Mount user routes under /api/users
const userRoutes = require('./userRoutes');
router.use('/api/users', userRoutes);

// Health check endpoint with Okta connectivity check
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service healthy
 *       503:
 *         description: Okta unreachable or auth failed
 */
router.get('/health', async (req, res) => {
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
    const OktaService = require('../services/oktaService');
    const oktaService = new OktaService();

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

module.exports = router;


