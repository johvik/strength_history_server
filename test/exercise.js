var request = require('superagent');
var should = require('should');

/**
 * Test that you cannot access data when not logged in
 */
describe('Exercise unauthorized check', function() {
  it('should not delete exercise', function(done) {
    request.del('/exercise/id').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(401);
      done();
    });
  });

  it('should not get', function(done) {
    request.get('/exercise/id').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(401);
      done();
    });
  });

  it('should not get', function(done) {
    request.get('/exercise/latest/id').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(401);
      done();
    });
  });

  it('should not get', function(done) {
    request.get('/exercise').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(401);
      done();
    });
  });

  it('should not save', function(done) {
    request.post('/exercise').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(401);
      done();
    });
  });

  it('should not update', function(done) {
    request.get('/exercise/id').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(401);
      done();
    });
  });
});
