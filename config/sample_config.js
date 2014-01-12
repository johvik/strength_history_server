// Use this as a template for config.js
exports.SERVER_PORT = 8080; // Port of your server
exports.SERVER_HTTP_PORT = 8000; // Port used for redirection from HTTP
exports.SERVER_ADDRESS = 'https://localhost:' + exports.SERVER_PORT; // The root address of your server
exports.SESSION_SECRET = 'secret'; // Used for express.session
// This email will be used to send activation e-mails
exports.EMAIL_ACCOUNT = 'some.email@localhost';
exports.EMAIL_PASSWORD = 'email password';
// Address to MongoDB
exports.MONGODB = 'mongodb://localhost:27017/db';

// Test section (optional, but required to run tests)
exports.SERVER_PORT_TEST = 8081; // Should usually be different from SERVER_PORT
exports.SERVER_HTTP_PORT_TEST = 8001; // Should usually be different from SERVER_HTTP_PORT
// E-mails aren't sent during tests
exports.MONGODB_TEST = 'mongodb://localhost:27017/test_db';
