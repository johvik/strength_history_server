var config = require('./config.js');
var TEST_ENV = process.env.NODE_ENV === 'test';

// Make sure nothing is missing in the config file
if (!config.SERVER_PORT || !config.SERVER_HTTP_PORT || !config.SERVER_ADDRESS || !config.SESSION_SECRET || !config.EMAIL_ACCOUNT || !config.EMAIL_PASSWORD || !config.MONGODB) {
  throw new Error('config.js is missing fields');
}

// Make sure test configuration isn't missing
if (TEST_ENV) {
  if (!config.SERVER_PORT_TEST || !config.SERVER_HTTP_PORT_TEST || !config.MONGODB_TEST) {
    throw new Error('config.js is missing test fields');
  }
  // Set test configuration
  exports.SERVER_PORT = config.SERVER_PORT_TEST;
  exports.SERVER_HTTP_PORT = config.SERVER_HTTP_PORT_TEST;
  // Use localhost as address for tests
  exports.SERVER_ADDRESS = 'http://localhost:' + config.SERVER_PORT_TEST;
  exports.SESSION_SECRET = 'not_tested';
  exports.EMAIL_ACCOUNT = 'not_tested';
  exports.EMAIL_PASSWORD = 'not_tested';
  exports.MONGODB = config.MONGODB_TEST;
} else {
  exports.SERVER_PORT = config.SERVER_PORT;
  exports.SERVER_HTTP_PORT = config.SERVER_HTTP_PORT;
  exports.SERVER_ADDRESS = config.SERVER_ADDRESS;
  exports.SESSION_SECRET = config.SESSION_SECRET;
  exports.EMAIL_ACCOUNT = config.EMAIL_ACCOUNT;
  exports.EMAIL_PASSWORD = config.EMAIL_PASSWORD;
  exports.MONGODB = config.MONGODB;
}
