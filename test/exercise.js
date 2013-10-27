var app = require('../');

var request = require('superagent');
var should = require('should');

/**
 * Test that you cannot access data when not logged in
 */
describe('Exercise unauthorized check', function() {
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
