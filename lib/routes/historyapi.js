var Weight = require('../db/weight').Model;
var WorkoutData = require('../db/workoutdata').Model;
var async = require('async');
var pageSize = 20; // For both collections

exports.get = function(req, res) {
  var userid = req.user._id;
  // Get all
  async.parallel([
    function(callback) {
      Weight.find({
        user : userid
      }, Weight.publicFields,
      // {
      // sort : {
      // time : -1
      // }
      // },
      callback);
    },
    function(callback) {
      WorkoutData.find({
        user : userid
      }, WorkoutData.publicFields,
      // {
      // sort : {
      // time : -1
      // }
      // },
      callback);
    }
  ], function(err, results) {
    if (err !== null) {
      res.send(400);
    } else {
      res.json(results[0].concat(results[1]));
    }
  });
};

exports.getPage = function(req, res) {
  var userid = req.user._id;
  // Pages id
  res.send('');
};

exports.getPages = function(req, res) {
  var userid = req.user._id;
  // Pages
  async.parallel([
    function(callback) {
      Weight.count({
        user : userid
      }, callback);
    },
    function(callback) {
      WorkoutData.count({
        user : userid
      }, callback);
    }
  ], function(err, results) {
    if (err !== null) {
      res.send(400);
    } else {
      var pages = Math.max(1, Math.ceil((results[0] + results[1]) / pageSize));
      res.json(pages);
    }
  });
};
