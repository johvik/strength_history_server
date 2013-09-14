var passport = require('passport');
var async = require('async');
var Exercise = require('../lib/db/exercise').Model;
var Workout = require('../lib/db/workout').Model;
var User = require('../lib/db/user').Model;

exports.activate = function(req, res) {
  var email = req.query.email;
  var key = req.query.key;
  if (email !== undefined && key !== undefined) {
    User.update({
      email : email,
      $and : [
        {
          activation : key
        },
        {
          activation : {
            $ne : 'done'
          }
        }
      ]
    }, {
      $set : {
        activation : 'done'
      }
    }, function(err, doc) {
      if (err !== null || doc === 0) {
        res.send(400);
      } else {
        res.send(200, 'Account activated!');
      }
    });
  } else {
    res.send(400);
  }
};

exports.getUserData = function(req, res) {
  res.contentType('application/javascript');
  if (req.isAuthenticated()) {
    var userid = req.user._id;
    async.parallel({
      exercises : function(callback) {
        Exercise.find({
          user : userid
        }, '_id name standardIncrease', callback);
      },
      workouts : function(callback) {
        Workout.find({
          user : userid
        }, '_id name exercises', callback);
      }
    }, function(err, results) {
      results.authenticated = true;
      res.send('define(\'userdata\',function(){return' + JSON.stringify(results) + '})');
    });
  } else {
    res.send('define(\'userdata\',function(){return' + JSON.stringify({
      authenticated : false
    }) + '})');
  }
};

exports.postLogin = function(req, res, next) {
  passport.authenticate('local', function(err1, user, info) {
    if (err1) {
      return next(err1);
    }
    if (!user) {
      return res.send(400, info.message);
    }
    req.logIn(user, function(err2) {
      if (err2) {
        return next(err2);
      }
      return res.send(200);
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
