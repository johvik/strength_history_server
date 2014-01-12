var app = require('../');
var config = require('../config/config.js');

var request = require('superagent');
var should = require('should');

var utils = require('./test_utils');
var User = require(utils.libPath + '/db/user').Model;
var EventEmitter = require('events').EventEmitter;

/**
 * Test the User
 */
describe('User', function() {
  var testUser = {
    email: 'testuser@localhost',
    password: 'testing'
  };
  var testUserActivation = '';
  var testUser2 = {};

  before(function(done) {
    // Make sure the test user is removed first
    User.remove({
      email: {
        $regex: testUser.email + '.*'
      }
    }, function(err1, doc1) {
      should.not.exist(err1);
      // Create the test user
      new User({
        email: testUser.email,
        password: testUser.password
      }).save(function(err2, doc2) {
        should.not.exist(err2);
        testUserActivation = doc2.activation;
        // Create an additional user to use for erase test
        utils.createUser('user', function(user) {
          testUser2 = user;
          done();
        });
      });
    });
  });

  after(function(done) {
    // Remove the test user
    User.remove({
      email: {
        $regex: testUser.email + '.*'
      }
    }, function(err1, doc1) {
      should.not.exist(err1);
      // Also remove the other test user
      utils.removeUser('user', done);
    });
  });

  /**
   * Test to activate the user
   */
  describe('Activation', function() {
    it('should not activate', function(done) {
      // Request activation without email
      request.get(config.SERVER_ADDRESS + '/activate?key=' + testUserActivation).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not activate', function(done) {
      // Request activation with wrong key
      request.get(config.SERVER_ADDRESS + '/activate?key=wrong_' + testUserActivation + '&email=' + testUser.email).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not login', function(done) {
      // Login without activation
      request.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should activate', function(done) {
      // Request activation with correct key
      request.get(config.SERVER_ADDRESS + '/activate?key=' + testUserActivation + '&email=' + testUser.email).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should login', function(done) {
      // Login after activation
      request.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should not activate', function(done) {
      // Request activation again
      request.get(config.SERVER_ADDRESS + '/activate?key=done&email=' + testUser.email).end(function(err, res) {
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
      agent.get(config.SERVER_ADDRESS + '/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not login', function(done) {
      agent.post(config.SERVER_ADDRESS + '/login').send({
        email: testUser.email
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should login', function(done) {
      agent.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should get exercises', function(done) {
      agent.get(config.SERVER_ADDRESS + '/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should logout', function(done) {
      agent.get(config.SERVER_ADDRESS + '/logout').redirects(0).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        done();
      });
    });

    it('should not get exercises', function(done) {
      agent.get(config.SERVER_ADDRESS + '/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not login', function(done) {
      // Wrong password
      request.post(config.SERVER_ADDRESS + '/login').send({
        email: testUser.email,
        password: 'abc'
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not login', function(done) {
      // Unknown email
      request.post(config.SERVER_ADDRESS + '/login').send({
        email: testUser.email + 'abc',
        password: 'abc'
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should logout', function(done) {
      request.get(config.SERVER_ADDRESS + '/logout?no_redirect').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });
  });

  /**
   * Test the user data
   */
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
      agent.get(config.SERVER_ADDRESS + '/js/userdata.js').pipe(stream);
    });

    it('should login', function(done) {
      agent.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
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
      agent.get(config.SERVER_ADDRESS + '/js/userdata.js').pipe(stream);
    });
  });

  /**
   * Test signup
   */
  describe('Signup', function() {
    it('should not signup', function(done) {
      // Email already in use
      request.post(config.SERVER_ADDRESS + '/signup').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(409);
        res.text.should.include('E-mail already in use.');
        done();
      });
    });

    it('should not signup', function(done) {
      // Email already in use
      request.post(config.SERVER_ADDRESS + '/signup').send({
        email: 'abc',
        password: 'abc'
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        res.text.should.include('Failed to create account, please try again later.');
        done();
      });
    });

    it('should not signup', function(done) {
      // No post data
      request.post(config.SERVER_ADDRESS + '/signup').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should signup', function(done) {
      request.post(config.SERVER_ADDRESS + '/signup').send({
        email: testUser.email + '2',
        password: testUser.password
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });
  });

  /**
   * Test erase
   */
  describe('Erase', function() {
    var agent1 = request.agent();
    var agent2 = request.agent();
    var savedWorkout1 = '';
    var savedWorkout2 = '';
    var savedId = '';

    it('should login', function(done) {
      agent1.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should login', function(done) {
      agent2.post(config.SERVER_ADDRESS + '/login').send(testUser2).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    // First create data for both test users
    it('should post', function(done) {
      agent1.post(config.SERVER_ADDRESS + '/exercise').send({
        name: 'abc',
        standardIncrease: 2.5,
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('name', 'abc');
        json.should.have.property('standardIncrease', 2.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'name', 'standardIncrease', 'sync');
        done();
      });
    });

    it('should post', function(done) {
      agent2.post(config.SERVER_ADDRESS + '/exercise').send({
        name: 'abc',
        standardIncrease: 2.5,
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('name', 'abc');
        json.should.have.property('standardIncrease', 2.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'name', 'standardIncrease', 'sync');
        done();
      });
    });

    it('should post', function(done) {
      agent1.post(config.SERVER_ADDRESS + '/weight').send({
        time: 456,
        weight: 75.5,
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('weight', 75.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'weight', 'sync');
        done();
      });
    });

    it('should post', function(done) {
      agent2.post(config.SERVER_ADDRESS + '/weight').send({
        time: 456,
        weight: 75.5,
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('weight', 75.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'weight', 'sync');
        done();
      });
    });

    it('should post', function(done) {
      agent1.post(config.SERVER_ADDRESS + '/workout').send({
        name: 'abc',
        exercises: [],
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('name', 'abc');
        json.should.have.property('exercises').and.eql([]);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'name', 'exercises', 'sync');
        savedWorkout1 = json._id;
        done();
      });
    });

    it('should post', function(done) {
      agent2.post(config.SERVER_ADDRESS + '/workout').send({
        name: 'abc',
        exercises: [],
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('name', 'abc');
        json.should.have.property('exercises').and.eql([]);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'name', 'exercises', 'sync');
        savedWorkout2 = json._id;
        done();
      });
    });

    it('should post', function(done) {
      agent1.post(config.SERVER_ADDRESS + '/workoutdata').send({
        time: 456,
        workout: savedWorkout1,
        data: [],
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('workout', savedWorkout1);
        json.should.have.property('data').and.eql([]);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'workout', 'data', 'sync');
        savedId = json._id;
        done();
      });
    });

    it('should post', function(done) {
      agent2.post(config.SERVER_ADDRESS + '/workoutdata').send({
        time: 456,
        workout: savedWorkout2,
        data: [],
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('workout', savedWorkout2);
        json.should.have.property('data').and.eql([]);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'workout', 'data', 'sync');
        savedId = json._id;
        done();
      });
    });

    it('should erase', function(done) {
      User.erase(testUser.email, function(err, res) {
        should.not.exist(err);
        res.should.eql([
          1,
          1,
          4,
          1,
          1,
          1
        ]);
        done();
      });
    });

    it('should erase', function(done) {
      // Check that the other delete didn't mess up the other one
      User.erase(testUser2.email, function(err, res) {
        should.not.exist(err);
        res.should.eql([
          1,
          1,
          4,
          1,
          1,
          1
        ]);
        done();
      });
    });
  });
});
