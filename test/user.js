var app = require('../');

var request = require('superagent');
var should = require('should');

var EventEmitter = require('events').EventEmitter;

var utils = require('./test_utils');

before(utils.createUser);

after(utils.removeUser);

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
      request.get('http://localhost:8080/activate?key=' + utils.testUserActivation).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not activate', function(done) {
      // Request activation with wrong key
      request.get('http://localhost:8080/activate?key=wrong_' + utils.testUserActivation + '&email=' + utils.testUser.email).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not login', function(done) {
      // Login without activation
      request.post('http://localhost:8080/login').send(utils.testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should activate', function(done) {
      // Request activation with correct key
      request.get('http://localhost:8080/activate?key=' + utils.testUserActivation + '&email=' + utils.testUser.email).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should login', function(done) {
      // Login after activation
      request.post('http://localhost:8080/login').send(utils.testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should not activate', function(done) {
      // Request activation again
      request.get('http://localhost:8080/activate?key=done&email=' + utils.testUser.email).end(function(err, res) {
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
        email : utils.testUser.email
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should login', function(done) {
      agent.post('http://localhost:8080/login').send(utils.testUser).end(function(err, res) {
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
        email : utils.testUser.email,
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
      var stream = new EventEmitter;
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
      agent.post('http://localhost:8080/login').send(utils.testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should get userData', function(done) {
      var stream = new EventEmitter;
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

  describe('Sign up', function() {
    it('should not signup', function(done) {
      request.post('http://localhost:8080/signup').send(utils.testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
  });
});
