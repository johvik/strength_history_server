// Use this as a template for config.js
exports.SERVER_ADDRESS = 'http://localhost'; // The root address of your server
exports.SESSION_SECRET = 'secret'; // Used for express.session
// This email will be used to send activation e-mails
exports.EMAIL_ACCOUNT = 'some.email@localhost';
exports.EMAIL_PASSWORD = 'email password';
// Settings for MongoDB
exports.MONGODB = {
  'hostname' : 'localhost',
  'port' : 27017,
  'username' : '',
  'password' : '',
  'name' : '',
  'db' : 'db'
};
