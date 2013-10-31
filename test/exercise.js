var app = require('../');

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
      request.del('http://localhost:8080/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get('http://localhost:8080/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get('http://localhost:8080/exercise/latest/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get('http://localhost:8080/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not save', function(done) {
      request.post('http://localhost:8080/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not put', function(done) {
      request.put('http://localhost:8080/exercise/id').end(function(err, res) {
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
      agent.post('http://localhost:8080/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should not get', function(done) {
      agent.get('http://localhost:8080/exercise/latest/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not get', function(done) {
      agent.get('http://localhost:8080/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not del', function(done) {
      agent.del('http://localhost:8080/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not post', function(done) {
      agent.post('http://localhost:8080/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not post', function(done) {
      agent.post('http://localhost:8080/exercise').send({
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
      agent.put('http://localhost:8080/exercise/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not put', function(done) {
      agent.put('http://localhost:8080/exercise/id').send({
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
      agent.post('http://localhost:8080/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should post', function(done) {
      agent.post('http://localhost:8080/exercise').send({
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

    it('should get', function(done) {
      agent.get('http://localhost:8080/exercise').end(function(err, res) {
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
      agent.get('http://localhost:8080/exercise/' + savedId).end(function(err, res) {
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
      agent.put('http://localhost:8080/exercise/' + savedId).send({
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
      agent.put('http://localhost:8080/exercise/' + savedId).send({
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
      agent.del('http://localhost:8080/exercise/' + savedId).end(function(err, res) {
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
