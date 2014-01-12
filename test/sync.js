var app = require('../');
var config = require('../config');

var request = require('superagent');
var should = require('should');

var utils = require('./test_utils');

/**
 * Test sync
 */
describe('Sync', function() {
  var testUser = {};

  before(function(done) {
    utils.createUser('sync', function(user) {
      testUser = user;
      done();
    });
  });

  after(function(done) {
    utils.removeUser('sync', done);
  });

  /**
   * Test that you cannot access data when not logged in
   */
  describe('Unauthorized check', function() {
    it('should not get', function(done) {
      request.get(config.SERVER_ADDRESS + '/sync').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
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
      agent.post(config.SERVER_ADDRESS + '/login').send(testUser).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should post', function(done) {
      agent.post(config.SERVER_ADDRESS + '/exercise').send({
        name: 'abc',
        standardIncrease: 2.5,
        sync: 123
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

    it('should del', function(done) {
      agent.del(config.SERVER_ADDRESS + '/exercise/' + savedId).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.property('_id', savedId);
        json.should.have.keys('_id');
        done();
      });
    });

    it('should get', function(done) {
      // After one add and remove
      agent.get(config.SERVER_ADDRESS + '/sync').end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        var json = JSON.parse(res.text);
        json.should.have.length(1);
        var o = json[0];
        o.should.have.property('table', 'exercise');
        o.should.have.property('hash', 0);
        o.should.have.property('counter', 1);
        o.should.have.keys('table', 'hash', 'counter');
        done();
      });
    });
  });
});
