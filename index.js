const serverless = require('serverless-http');
const app = require('./expressApp'); // Your Express app

module.exports.handler = serverless(app);
