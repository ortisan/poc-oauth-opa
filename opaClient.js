const axios = require('axios');

const opaClient = axios.create({
  baseURL: 'http://localhost:8181/v1', // OPA API endpoint
  timeout: 5000,                      // Request timeout
});

module.exports = opaClient;