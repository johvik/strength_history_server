var strength_history = require('../');

var request = require('superagent');
var should = require('should');

/**
 * Test some http requests
 */
describe('Request index.html', function() {
  it('should get root', function(done) {
    request.get('/').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get signup', function(done) {
    request.get('/signup').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get exercises', function(done) {
    request.get('/exercises').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get workouts', function(done) {
    request.get('/workouts').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get history', function(done) {
    request.get('/history').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });
});
