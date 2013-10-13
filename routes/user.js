var passport = require('passport');
var async = require('async');
var Exercise = require('../lib/db/exercise').Model;
var Workout = require('../lib/db/workout').Model;
var User = require('../lib/db/user').Model;
var mail = require('../lib/mail');

exports.postSignUp = function(req, res) {
  return res.send(400, 'Account creation has been disabled during development.'); // TODO Activate signup again
  var email = req.body.email;
  var password = req.body.password;
  if (email !== undefined && password !== undefined) {
    new User({
      email : email,
      password : password
    }).save(function(err1, doc1) {
      if (err1 !== null || doc1 === null) {
        // Failed to save
        if (err1.code === 11000) { // code for duplicate key
          res.send(409, 'E-mail already in use.');
        } else {
          res.send(400, 'Failed to create account, please try again later.');
        }
      } else {
        mail.sendActivation(doc1.email, doc1.activation, function(err2, doc2) {
          if (err2) {
            // Failed to send mail, remove from DB
            User.remove({
              _id : doc1._id,
              email : email
            }, function(err3, doc3) {
              res.send(400, 'Failed to create account, please try again later.');
            });
          } else {
            res.send(200);
          }
        });
      }
    });
  } else {
    res.send(400);
  }
};

exports.activate = function(req, res) {
  var email = req.query.email;
  var key = req.query.key;
  if (email !== undefined && key !== undefined && key !== 'done') {
    User.update({
      email : email,
      activation : key
    }, {
      $set : {
        activation : 'done'
      }
    }, function(err, doc) {
      if (err !== null || doc === 0) {
        res.send(400, 'Invalid activation link.');
      } else {
        res.send(200, 'Account activated!');
      }
    });
  } else {
    res.send(400, 'Invalid activation link.');
  }
};

exports.getUserData = function(req, res) {
  res.contentType('application/javascript');
  res.header("Cache-Control", "no-cache");
  if (req.isAuthenticated()) {
    var userid = req.user._id;
    async.parallel({
      exercises : function(callback) {
        Exercise.find({
          user : userid
        }, Exercise.publicFields, callback);
      },
      workouts : function(callback) {
        Workout.find({
          user : userid
        }, Workout.publicFields, callback);
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
