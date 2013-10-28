var should = require('should');

exports.libPath = process.env.STRENGTH_HISTORY_COV ? '../lib-cov' : '../lib';

var User = require(exports.libPath + '/db/user').Model;

exports.testUser = {
  email : 'testuser@localhost',
  password : 'testing'
};
exports.testUserActivation = '';

exports.createUser = function(done) {
  // Make sure the test user is removed first
  User.remove({
    email : {
      $regex : exports.testUser.email + '.*'
    }
  }, function(err1, doc1) {
    should.not.exist(err1);
    // Create the test user
    new User({
      email : exports.testUser.email,
      password : exports.testUser.password
    }).save(function(err2, doc2) {
      should.not.exist(err2);
      exports.testUserActivation = doc2.activation;
      done();
    });
  });
};

exports.removeUser = function(done) {
  // Remove the test user
  User.remove({
    email : {
      $regex : exports.testUser.email + '.*'
    }
  }, function(err1, doc1) {
    should.not.exist(err1);
    done();
  });
};
