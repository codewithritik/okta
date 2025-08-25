require('dotenv').config();

const oktaConfig = {
  domain: process.env.OKTA_DOMAIN,
  apiToken: process.env.OKTA_API_TOKEN,
  baseUrl: `${process.env.OKTA_DOMAIN}/api/v1`
};

if (!oktaConfig.domain || !oktaConfig.apiToken) {
  throw new Error('Missing required environment variables: OKTA_DOMAIN and OKTA_API_TOKEN');
}

module.exports = oktaConfig;