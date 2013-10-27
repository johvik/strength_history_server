var libPath = process.env.STRENGTH_HISTORY_COV ? '../lib-cov' : '../lib';
var app = require('../');

var request = require('superagent');
var should = require('should');

var User = require(libPath + '/db/user').Model;

var testUser = {
  email : 'testuser@localhost',
  password : 'testing'
};
var testUserActivation;

before(function(done) {
  // Make sure the test user is removed
  User.remove({
    email : testUser.email
  }, function(err1, doc1) {
    should.not.exist(err1);
    // Create a user for the test
    new User({
      email : testUser.email,
      password : testUser.password
    }).save(function(err2, doc2) {
      should.not.exist(err2);
      testUserActivation = doc2.activation;
      done();
    });
  });
});

after(function(done) {
  // Remove the test user after the test
  User.remove({
    email : testUser.email
  }, function(err1, doc1) {
    should.not.exist(err1);
    done();
  });
});

/**
 * Test the User
 */
describe('User', function() {
  /**
   * Test to activate the user
   */
  describe('Activation', function() {
    it('should not activate', function(done) {
      // Request activation without email
      request.get('http://localhost:8080/activate?key=' + testUserActivation).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not activate', function(done) {
      // Request activation with wrong key
      request.get('http://localhost:8080/activate?key=wrong_' + testUserActivation + '&email=' + testUser.email).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not login', function(done) {
      // Login without activation
      request.post('http://localhost:8080/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should activate', function(done) {
      // Request activation with correct key
      request.get('http://localhost:8080/activate?key=' + testUserActivation + '&email=' + testUser.email).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should login', function(done) {
      // Login after activation
      request.post('http://localhost:8080/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should not activate', function(done) {
      // Request activation again
      request.get('http://localhost:8080/activate?key=done&email=' + testUser.email).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
  });

  /**
   * Test an access sequence
   */
  describe('Access', function() {
    var agent = request.agent();

    it('should not get exercises', function(done) {
      agent.get('http://localhost:8080/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not login', function(done) {
      agent.post('http://localhost:8080/login').send({
        email : testUser.email
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should login', function(done) {
      agent.post('http://localhost:8080/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should get exercises', function(done) {
      agent.get('http://localhost:8080/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should logout', function(done) {
      agent.get('http://localhost:8080/logout').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should not get exercises', function(done) {
      agent.get('http://localhost:8080/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });
  });
});
