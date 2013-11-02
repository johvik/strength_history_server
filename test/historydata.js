var app = require('../');

var request = require('superagent');
var should = require('should');

var utils = require('./test_utils');

/**
 * Test historydata
 */
describe('HistoryData', function() {
  var testUser = {};

  before(function(done) {
    utils.createUser('historydata', function(user) {
      testUser = user;
      done();
    });
  });

  after(function(done) {
    utils.removeUser('historydata', done);
  });

  /**
   * Test that you cannot access data when not logged in
   */
  describe('Unauthorized check', function() {
    it('should not get', function(done) {
      request.get('http://localhost:8080/historydata').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get('http://localhost:8080/historydata/pages/1').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('should not get', function(done) {
      request.get('http://localhost:8080/historydata/pages').end(function(err, res) {
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

    it('should get', function(done) {
      agent.get('http://localhost:8080/historydata').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.eql([]);
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/historydata/pages/1').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.equal('');
        done();
      });
    });

    it('should get', function(done) {
      agent.get('http://localhost:8080/historydata/pages').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.text.should.equal('1');
        done();
      });
    });
  });
});
