var app = require('../');

var request = require('superagent');
var should = require('should');

var utils = require('./test_utils');

before(utils.createUser);

/**
 * Test weight
 */
describe('Weight', function() {
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

    it('should not update', function(done) {
      request.get('http://localhost:8080/weight/id').end(function(err, res) {
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
        sync : 123,
        time : 123,
        weight : 'abc'
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
        sync : 123,
        time : 456,
        weight : 75.5
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
      agent.post('http://localhost:8080/weight').send({
        sync : 123,
        time : 456,
        weight : 75.5
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('456');
        res.text.should.include('75.5');
        var weight = JSON.parse(res.text);
        should.exist(weight._id);
        savedId = weight._id;
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/weight').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('456');
        res.text.should.include('75.5');
        res.text.should.include(savedId);
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/weight/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('456');
        res.text.should.include('75.5');
        res.text.should.include(savedId);
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/weight/latest').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('456');
        res.text.should.include('75.5');
        res.text.should.include(savedId);
        done();
      });
    });

    it('should put', function(done) {
      agent.put('http://localhost:8080/weight/' + savedId).send({
        sync : 123,
        time : 789,
        weight : 99.9
      }).end(function(err, res) {
        // Should not update because of sync
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('456');
        res.text.should.include('75.5');
        done();
      });
    });

    it('should put', function(done) {
      agent.put('http://localhost:8080/weight/' + savedId).send({
        sync : new Date().getTime() + 100000, // Make sure sync is big enough
        time : 789,
        weight : 99.9
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.include('789');
        res.text.should.include('99.9');
        done();
      });
    });

    it('should del', function(done) {
      agent.del('http://localhost:8080/weight/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });
  });
});
