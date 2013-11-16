var app = require('../');
var config = require('../config');

var request = require('superagent');
var should = require('should');

var utils = require('./test_utils');

/**
 * Test exercise
 */
describe('Exercise', function() {
  var testUser = {};

  before(function(done) {
    utils.createUser('exercise', function(user) {
      testUser = user;
      done();
    });
  });

  after(function(done) {
    utils.removeUser('exercise', done);
  });

  /**
   * Test that you cannot access data when not logged in
   */
  describe('Unauthorized check', function() {
    it('should not del', function(done) {
      request.del(config.SERVER_ADDRESS + '/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get(config.SERVER_ADDRESS + '/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get(config.SERVER_ADDRESS + '/exercise/latest/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get(config.SERVER_ADDRESS + '/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not save', function(done) {
      request.post(config.SERVER_ADDRESS + '/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not put', function(done) {
      request.put(config.SERVER_ADDRESS + '/exercise/id').end(function(err, res) {
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

    it('should login', function(done) {
      agent.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should not get', function(done) {
      agent.get(config.SERVER_ADDRESS + '/exercise/latest/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not get', function(done) {
      agent.get(config.SERVER_ADDRESS + '/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not del', function(done) {
      agent.del(config.SERVER_ADDRESS + '/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/exercise').send({
        name : '',
        standardIncrease : 2.5,
        sync : 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not put', function(done) {
      agent.put(config.SERVER_ADDRESS + '/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not put', function(done) {
      agent.put(config.SERVER_ADDRESS + '/exercise/id').send({
        name : 'abc',
        standardIncrease : 2.5,
        sync : 123
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

    it('should login', function(done) {
      agent.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/exercise').send({
        name : 'abc',
        standardIncrease : 2.5,
        sync : 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('name', 'abc');
        json.should.have.property('standardIncrease', 2.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'name', 'standardIncrease', 'sync');
        savedId = json._id;
        done();
      });
    });

    it('should post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/workout').send({
        name : 'abc',
        exercises : [
          savedId
        ],
        sync : 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('name', 'abc');
        json.should.have.property('exercises').and.eql([
          savedId
        ]);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'name', 'exercises', 'sync');
        savedWorkout = json._id;
        done();
      });
    });

    it('should post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/workoutdata').send({
        time : 456,
        workout : savedWorkout,
        data : [
          {
            exercise : savedId,
            sets : [
              {
                weight : 55.2,
                reps : 12
              }
            ]
          }
        ],
        sync : 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('workout', savedWorkout);
        json.should.have.property('data');
        var data = json.data;
        data.should.have.length(1);
        var o = data[0];
        o.should.have.property('exercise', savedId);
        o.should.have.property('sets');
        var sets = o.sets;
        sets.should.have.length(1);
        sets[0].should.have.property('weight', 55.2);
        sets[0].should.have.property('reps', 12);
        sets[0].should.have.keys('weight', 'reps');
        o.should.have.keys('exercise', 'sets');
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'workout', 'data', 'sync');
        done();
      });
    });

    it('should get', function(done) {
      agent.get(config.SERVER_ADDRESS + '/exercise/latest/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('workout', savedWorkout);
        json.should.have.property('data');
        var data = json.data;
        data.should.have.length(1);
        var o = data[0];
        o.should.have.property('exercise', savedId);
        o.should.have.property('sets');
        var sets = o.sets;
        sets.should.have.length(1);
        sets[0].should.have.property('weight', 55.2);
        sets[0].should.have.property('reps', 12);
        sets[0].should.have.keys('weight', 'reps');
        o.should.have.keys('exercise', 'sets');
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'workout', 'data', 'sync');
        done();
      });
    });

    it('should get', function(done) {
      agent.get(config.SERVER_ADDRESS + '/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.length(1);
        var o = json[0];
        o.should.have.property('_id', savedId);
        o.should.have.property('name', 'abc');
        o.should.have.property('standardIncrease', 2.5);
        o.should.have.property('sync', 123);
        o.should.have.keys('_id', 'name', 'standardIncrease', 'sync');
        done();
      });
    });

    it('should get', function(done) {
      agent.get(config.SERVER_ADDRESS + '/exercise/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('_id', savedId);
        json.should.have.property('name', 'abc');
        json.should.have.property('standardIncrease', 2.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'name', 'standardIncrease', 'sync');
        done();
      });
    });

    it('should put', function(done) {
      agent.put(config.SERVER_ADDRESS + '/exercise/' + savedId).send({
        name : 'ABC',
        standardIncrease : 7.5,
        sync : 123
      }).end(function(err, res) {
        // Should not update because of sync
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('_id', savedId);
        json.should.have.property('name', 'abc');
        json.should.have.property('standardIncrease', 2.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'name', 'standardIncrease', 'sync');
        done();
      });
    });

    it('should put', function(done) {
      agent.put(config.SERVER_ADDRESS + '/exercise/' + savedId).send({
        name : 'ABC',
        standardIncrease : 7.5,
        // Make sure sync is bigger
        sync : 100000
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('_id', savedId);
        json.should.have.property('name', 'ABC');
        json.should.have.property('standardIncrease', 7.5);
        json.should.have.property('sync', 100000);
        json.should.have.keys('_id', 'name', 'standardIncrease', 'sync');
        done();
      });
    });

    it('should del', function(done) {
      agent.del(config.SERVER_ADDRESS + '/exercise/' + savedId).end(function(err, res) {
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
