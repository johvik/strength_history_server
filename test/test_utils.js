process.env.NODE_ENV = 'test';

var config = require('../config');

var request = require('superagent');
var should = require('should');

var User = require('../lib/db/user').Model;

var email = 'test@localhost';
var password = 'testing';

/**
 * @param base
 *          Will be added at the beginning of the email
 * @param cb
 *          Callback function taking one argument - testUser object
 */
exports.createUser = function(base, cb) {
  exports.removeUser(base, function() {
    var testUser = {
      email: base + email,
      password: password
    };
    // Create the test user
    new User(testUser).save(function(err, doc) {
      should.not.exist(err);
      // Activate
      request.get(config.SERVER_ADDRESS + '/activate?key=' + doc.activation + '&email=' + testUser.email).end(function(err2, res) {
        should.not.exist(err2);
        // Return user in the callback
        cb(testUser);
      });
    });
  });
};

/**
 * @param base
 *          Will be added at the beginning of the email
 * @param cb
 *          Callback function taking no arguments
 */
exports.removeUser = function(base, cb) {
  // Remove the test user
  User.erase(base + email, function(err, res) {
    should.not.exist(err);
    cb();
  });
};
