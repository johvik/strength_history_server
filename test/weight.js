var app = require('../');

var request = require('superagent');
var should = require('should');

var utils = require('./test_utils');

/**
 * Test weight
 */
describe('Weight', function() {
  var testUser = {};

  before(function(done) {
    utils.createUser('weight', function(user) {
      testUser = user;
      done();
    });
  });

  after(function(done) {
    utils.removeUser('weight', done);
  });

  /**
   * Test that you cannot access data when not logged in
   */
  describe('Unauthorized check', function() {
    it('should not del', function(done) {
      request.del('http://localhost:8080/weight/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get('http://localhost:8080/weight/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get('http://localhost:8080/weight/latest').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get('http://localhost:8080/weight').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not save', function(done) {
      request.post('http://localhost:8080/weight').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not put', function(done) {
      request.put('http://localhost:8080/weight/id').end(function(err, res) {
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
      agent.get('http://localhost:8080/weight/latest').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not get', function(done) {
      agent.get('http://localhost:8080/weight/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not del', function(done) {
      agent.del('http://localhost:8080/weight/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not post', function(done) {
      agent.post('http://localhost:8080/weight').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not post', function(done) {
      agent.post('http://localhost:8080/weight').send({
        time : 123,
        weight : 'abc',
        sync : 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not put', function(done) {
      agent.put('http://localhost:8080/weight/id').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });

    it('should not put', function(done) {
      agent.put('http://localhost:8080/weight/id').send({
        time : 456,
        weight : 75.5,
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
      agent.post('http://localhost:8080/weight').send({
        time : 456,
        weight : 75.5,
        sync : 123
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('time', 456);
        json.should.have.property('weight', 75.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'weight', 'sync');
        savedId = json._id;
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/weight').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.length(1);
        var o = json[0];
        o.should.have.property('_id', savedId);
        o.should.have.property('time', 456);
        o.should.have.property('weight', 75.5);
        o.should.have.property('sync', 123);
        o.should.have.keys('_id', 'time', 'weight', 'sync');
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/weight/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('_id', savedId);
        json.should.have.property('time', 456);
        json.should.have.property('weight', 75.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'weight', 'sync');
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/weight/latest').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('_id', savedId);
        json.should.have.property('time', 456);
        json.should.have.property('weight', 75.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'weight', 'sync');
        done();
      });
    });

    it('should put', function(done) {
      agent.put('http://localhost:8080/weight/' + savedId).send({
        time : 789,
        weight : 99.9,
        sync : 123
      }).end(function(err, res) {
        // Should not update because of sync
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('_id', savedId);
        json.should.have.property('time', 456);
        json.should.have.property('weight', 75.5);
        json.should.have.property('sync', 123);
        json.should.have.keys('_id', 'time', 'weight', 'sync');
        done();
      });
    });

    it('should put', function(done) {
      agent.put('http://localhost:8080/weight/' + savedId).send({
        time : 789,
        weight : 99.9,
        // Make sure sync is bigger
        sync : 100000
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('_id', savedId);
        json.should.have.property('time', 789);
        json.should.have.property('weight', 99.9);
        json.should.have.property('sync', 100000);
        json.should.have.keys('_id', 'time', 'weight', 'sync');
        done();
      });
    });

    it('should del', function(done) {
      agent.del('http://localhost:8080/weight/' + savedId).end(function(err, res) {
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
