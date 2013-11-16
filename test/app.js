var app = require('../');
var config = require('../config');

var request = require('superagent');
var should = require('should');

/**
 * Test some http requests
 */
describe('Request index.html', function() {
  it('should get root', function(done) {
    request.get(config.SERVER_ADDRESS).end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get signup', function(done) {
    request.get(config.SERVER_ADDRESS + '/signup').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get exercises', function(done) {
    request.get(config.SERVER_ADDRESS + '/exercises').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get workouts', function(done) {
    request.get(config.SERVER_ADDRESS + '/workouts').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });

  it('should get history', function(done) {
    request.get(config.SERVER_ADDRESS + '/history').end(function(err, res) {
      should.not.exist(err);
      res.should.have.status(200);
      res.text.should.include('Loading...');
      res.text.should.include('Strength History');
      done();
    });
  });
});
