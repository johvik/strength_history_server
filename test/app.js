var app = require('../');

var request = require('superagent');
var should = require('should');

/**
 * Test some http requests
 */
describe('Request index.html', function() {
  it('should get root', function(done) {
    request.get('http://localhost:8080/').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(201);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get signup', function(done) {
    request.get('http://localhost:8080/signup').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get exercises', function(done) {
    request.get('http://localhost:8080/exercises').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get workouts', function(done) {
    request.get('http://localhost:8080/workouts').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get history', function(done) {
    request.get('http://localhost:8080/history').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });
});
