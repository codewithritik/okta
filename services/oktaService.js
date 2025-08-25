const axios = require('axios');
const oktaConfig = require('../config/okta');

class OktaService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: oktaConfig.baseUrl,
      headers: {
        'Authorization': `SSWS ${oktaConfig.apiToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  /**
   * Fetch all users with pagination
   * @param {number} limit - Number of users per page
   * @param {string} after - Cursor for pagination
   * @param {string} filter - Optional filter
   * @returns {Promise<Object>} Users data with pagination
   */
  async getUsers(limit = 20, after = null, filter = null) {
    try {
      const params = { limit };
      if (after) params.after = after;
      if (filter) params.filter = filter;

      const response = await this.axiosInstance.get('/users', { params });
      
      return {
        success: true,
        data: response.data.map(user => ({
          id: user.id,
          status: user.status,
          created: user.created,
          activated: user.activated,
          lastLogin: user.lastLogin,
          profile: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            email: user.profile.email,
            login: user.profile.login
          }
        })),
        pagination: {
          hasNext: response.headers.link && response.headers.link.includes('rel="next"'),
          nextCursor: this.extractNextCursor(response.headers.link),
          totalCount: response.data.length
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.response?.data?.errorSummary || error.message}`);
    }
  }

  /**
   * Fetch user by ID
   * @param {string} userId - Okta user ID
   * @returns {Promise<Object>} User profile
   */
  async getUserById(userId) {
    try {
      const response = await this.axiosInstance.get(`/users/${userId}`);
      const user = response.data;
      
      return {
        success: true,
        data: {
          id: user.id,
          status: user.status,
          created: user.created,
          activated: user.activated,
          lastLogin: user.lastLogin,
          profile: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            email: user.profile.email,
            login: user.profile.login
          }
        }
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`Failed to fetch user: ${error.response?.data?.errorSummary || error.message}`);
    }
  }

  /**
   * Fetch devices/factors for a user
   * @param {string} userId - Okta user ID
   * @returns {Promise<Object>} User's devices/factors
   */
  async getUserDevices(userId) {
    try {
      const response = await this.axiosInstance.get(`/users/${userId}/factors`);
      
      const devices = response.data.map(factor => ({
        id: factor.id,
        factorType: factor.factorType,
        provider: factor.provider,
        status: factor.status,
        created: factor.created,
        lastUpdated: factor.lastUpdated,
        profile: factor.profile || {}
      }));

      return {
        success: true,
        data: devices,
        count: devices.length
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`Failed to fetch user devices: ${error.response?.data?.errorSummary || error.message}`);
    }
  }

  /**
   * Fetch user with their devices
   * @param {string} userId - Okta user ID
   * @returns {Promise<Object>} User profile with devices
   */
  async getUserWithDevices(userId) {
    try {
      const [userResponse, devicesResponse] = await Promise.all([
        this.getUserById(userId),
        this.getUserDevices(userId)
      ]);

      return {
        success: true,
        data: {
          user: userResponse.data,
          devices: devicesResponse.data,
          deviceCount: devicesResponse.count
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract next cursor from Link header
   * @param {string} linkHeader - Link header value
   * @returns {string|null} Next cursor
   */
  extractNextCursor(linkHeader) {
    if (!linkHeader) return null;
    
    const nextMatch = linkHeader.match(/<[^>]*[?&]after=([^&>]+)[^>]*>;\s*rel="next"/);
    return nextMatch ? decodeURIComponent(nextMatch[1]) : null;
  }
}

module.exports = OktaService;