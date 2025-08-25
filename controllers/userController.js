const OktaService = require('../services/oktaService');

class UserController {
  constructor() {
    this.oktaService = new OktaService();
  }

  /**
   * GET /api/users - Fetch all users
   */
  async getUsers(req, res) {
    try {
      const { limit, after, filter } = req.query;
      const result = await this.oktaService.getUsers(
        parseInt(limit) || 20,
        after,
        filter
      );
      
      res.json(result);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/users/:userId/devices - Fetch user devices
   */
  async getUserDevices(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.oktaService.getUserDevices(userId);
      
      res.json(result);
    } catch (error) {
      console.error(`Error fetching devices for user ${req.params.userId}:`, error.message);
      const statusCode = error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/users/:userId - Fetch user with devices
   */
  async getUserWithDevices(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.oktaService.getUserWithDevices(userId);
      
      res.json(result);
    } catch (error) {
      console.error(`Error fetching user with devices ${req.params.userId}:`, error.message);
      const statusCode = error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UserController;
