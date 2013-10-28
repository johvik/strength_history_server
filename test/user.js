var app = require('../');

var request = require('superagent');
var should = require('should');

var utils = require('./test_utils');
var User = require(utils.libPath + '/db/user').Model;
var EventEmitter = require('events').EventEmitter;

var testUser = {
  email : 'testuser2@localhost',
  password : 'testing'
};
var testUserActivation = '';

before(function(done) {
  // Make sure the test user is removed first
  User.remove({
    email : {
      $regex : testUser.email + '.*'
    }
  }, function(err1, doc1) {
    should.not.exist(err1);
    // Create the test user
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
  // Remove the test user
  User.remove({
    email : {
      $regex : testUser.email + '.*'
    }
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
      agent.get('http://localhost:8080/logout').redirects(0).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(302);
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

    it('should not login', function(done) {
      // Wrong password
      request.post('http://localhost:8080/login').send({
        email : testUser.email,
        password : 'abc'
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should logout', function(done) {
      request.get('http://localhost:8080/logout?no_redirect').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });
  });

  describe('User data', function() {
    var agent = request.agent();
    it('should get userData', function(done) {
      var stream = new EventEmitter();
      stream.buf = '';
      stream.writable = true;
      stream.write = function(chunk) {
        this.buf += chunk;
      };
      stream.end = function() {
        this.buf.should.include('"authenticated":false');
        done();
      };
      agent.get('http://localhost:8080/js/userdata.js').pipe(stream);
    });

    it('should login', function(done) {
      agent.post('http://localhost:8080/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should get userData', function(done) {
      var stream = new EventEmitter();
      stream.buf = '';
      stream.writable = true;
      stream.write = function(chunk) {
        this.buf += chunk;
      };
      stream.end = function() {
        this.buf.should.include('"authenticated":true');
        done();
      };
      agent.get('http://localhost:8080/js/userdata.js').pipe(stream);
    });
  });

  describe('Signup', function() {
    it('should not signup', function(done) {
      // Email already in use
      request.post('http://localhost:8080/signup').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(409);
        res.text.should.include('E-mail already in use.');
        done();
      });
    });

    it('should not signup', function(done) {
      // Email already in use
      request.post('http://localhost:8080/signup').send({
        email : 'abc',
        password : 'abc'
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        res.text.should.include('Failed to create account, please try again later.');
        done();
      });
    });

    it('should not signup', function(done) {
      // No post data
      request.post('http://localhost:8080/signup').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should signup', function(done) {
      request.post('http://localhost:8080/signup').send({
        email : testUser.email + '2',
        password : testUser.password
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });
  });
});
