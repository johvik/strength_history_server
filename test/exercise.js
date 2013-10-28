var app = require('../');

var request = require('superagent');
var should = require('should');

var utils = require('./test_utils');

before(utils.createUser);

/**
 * Test exercise
 */
describe('Exercise', function() {
  /**
   * Test that you cannot access data when not logged in
   */
  describe('Unauthorized check', function() {
    it('should not delete exercise', function(done) {
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

    it('should not update', function(done) {
      request.get('http://localhost:8080/exercise/id').end(function(err, res) {
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
      agent.post('http://localhost:8080/login').send(utils.testUser).end(function(err, res) {
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
        sync : 123,
        name : '',
        standardIncrease : 2.5
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
        sync : 123,
        name : 'abc',
        standardIncrease : 2.5
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
      agent.post('http://localhost:8080/login').send(utils.testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should post', function(done) {
      agent.post('http://localhost:8080/exercise').send({
        sync : 123,
        name : 'abc',
        standardIncrease : 2.5
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('abc');
        res.text.should.include('2.5');
        var exercise = JSON.parse(res.text);
        should.exist(exercise._id);
        savedId = exercise._id;
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/exercise').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('abc');
        res.text.should.include('2.5');
        res.text.should.include(savedId);
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/exercise/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('abc');
        res.text.should.include('2.5');
        res.text.should.include(savedId);
        done();
      });
    });

    it('should put', function(done) {
      agent.put('http://localhost:8080/exercise/' + savedId).send({
        sync : 123,
        name : 'ABC',
        standardIncrease : 7.5
      }).end(function(err, res) {
        // Should not update because of sync
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('abc');
        res.text.should.include('2.5');
        done();
      });
    });

    it('should put', function(done) {
      agent.put('http://localhost:8080/exercise/' + savedId).send({
        sync : new Date().getTime() + 100000, // Make sure sync is big enough
        name : 'ABC',
        standardIncrease : 7.5
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('ABC');
        res.text.should.include('7.5');
        done();
      });
    });

    it('should del', function(done) {
      agent.del('http://localhost:8080/exercise/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });
  });
});
