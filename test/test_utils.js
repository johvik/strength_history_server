var request = require('superagent');
var should = require('should');

exports.libPath = process.env.STRENGTH_HISTORY_COV ? '../lib-cov' : '../lib';

var User = require(exports.libPath + '/db/user').Model;

exports.testUser = {
  email : 'testuser@localhost',
  password : 'testing'
};

exports.testUserId = '';

exports.createUser = function(done) {
  // Create the test user
  new User({
    email : exports.testUser.email,
    password : exports.testUser.password
  }).save(function(err, doc) {
    if (err === null) {
      exports.testUserId = doc._id;
      // Activate
      request.get('http://localhost:8080/activate?key=' + doc.activation + '&email=' + exports.testUser.email).end(function(err2, res) {
        done();
      });
    } else {
      done();
    }
  });
};

exports.removeUser = function(done) {
  // Remove the test user
  User.remove({
    email : exports.testUser.email
  }, function(err1, doc1) {
    should.not.exist(err1);
    done();
  });
};
