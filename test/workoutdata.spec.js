process.env.NODE_ENV = 'test';

var app = require('../');
var config = require('../config');

var request = require('superagent');
var should = require('should');

var utils = require('./test_utils');

/**
 * Test workoutdata
 */
describe('WorkoutData', function() {
  var testUser = {};

  before(function(done) {
    utils.createUser('workoutdata', function(user) {
      testUser = user;
      done();
    });
  });

  after(function(done) {
    utils.removeUser('workoutdata', done);
  });

  /**
   * Test that you cannot access data when not logged in
   */
  describe('Unauthorized check', function() {
    it('should not del', function(done) {
      request.del(config.SERVER_ADDRESS + '/workoutdata/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get(config.SERVER_ADDRESS + '/workoutdata/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get(config.SERVER_ADDRESS + '/workoutdata').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not save', function(done) {
      request.post(config.SERVER_ADDRESS + '/workoutdata').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not put', function(done) {
      request.put(config.SERVER_ADDRESS + '/workoutdata/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });
  });

  /**
   * Test the routes
   */
  describe('Routes', function() {
    var agent = request.agent();
    var savedWorkout = '';

    it('should login', function(done) {
      agent.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/workout').send({
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
        savedWorkout = json._id;
        done();
      });
    });

    it('should not get', function(done) {
      agent.get(config.SERVER_ADDRESS + '/workoutdata/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not del', function(done) {
      agent.del(config.SERVER_ADDRESS + '/workoutdata/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/workoutdata').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/workoutdata').send({
        time: 456,
        workout: {},
        data: [],
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not put', function(done) {
      agent.put(config.SERVER_ADDRESS + '/workoutdata/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not put', function(done) {
      agent.put(config.SERVER_ADDRESS + '/workoutdata/id').send({
        time: 456,
        workout: savedWorkout,
        data: [],
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
  });

  /**
   * Test a sequence
   */
  describe('Sequence', function() {
    var agent = request.agent();
    var savedId = '';
    var savedWorkout = '';

    it('should login', function(done) {
      agent.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/workout').send({
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
        savedWorkout = json._id;
        done();
      });
    });

    it('should post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/workoutdata').send({
        time: 456,
        workout: savedWorkout,
        data: [],
        sync: 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('workout', savedWorkout);
        json.should.have.property('data').and.eql([]);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'workout', 'data', 'sync');
        savedId = json._id;
        done();
      });
    });

    it('should get', function(done) {
      agent.get(config.SERVER_ADDRESS + '/workoutdata').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.length(1);
        var o = json[0];
        o.should.have.property('time', 456);
        o.should.have.property('workout', savedWorkout);
        o.should.have.property('data').and.eql([]);
        o.should.have.property('sync', 123);
        o.should.have.keys('_id', 'time', 'workout', 'data', 'sync');
        done();
      });
    });

    it('should get', function(done) {
      agent.get(config.SERVER_ADDRESS + '/workoutdata/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('workout', savedWorkout);
        json.should.have.property('data').and.eql([]);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'workout', 'data', 'sync');
        done();
      });
    });

    it('should put', function(done) {
      agent.put(config.SERVER_ADDRESS + '/workoutdata/' + savedId).send({
        time: 789,
        workout: savedWorkout,
        data: [],
        sync: 123
      }).end(function(err, res) {
        // Should not update because of sync
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('workout', savedWorkout);
        json.should.have.property('data').and.eql([]);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'workout', 'data', 'sync');
        done();
      });
    });

    it('should put', function(done) {
      agent.put(config.SERVER_ADDRESS + '/workoutdata/' + savedId).send({
        time: 789,
        workout: savedWorkout,
        data: [],
        // Make sure sync is bigger
        sync: 100000
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 789);
        json.should.have.property('workout', savedWorkout);
        json.should.have.property('data').and.eql([]);
        json.should.have.property('sync', 100000);
        json.should.have.keys('_id', 'time', 'workout', 'data', 'sync');
        done();
      });
    });

    it('should del', function(done) {
      agent.del(config.SERVER_ADDRESS + '/workoutdata/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('_id', savedId);
        json.should.have.keys('_id');
        done();
      });
    });
  });
});
