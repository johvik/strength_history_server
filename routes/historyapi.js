var Weight = require('../lib/db/weight').Model;
var WorkoutData = require('../lib/db/workoutdata').Model;
var async = require('async');
var pageSize = 20; // For each collection

exports.get = function(req, res) {
  var userid = req.user._id;
  // Get all
  async.parallel([
    function(callback) {
      WorkoutData.find({
        user : userid
      }, '_id time workout data',
      // {
      // sort : {
      // time : -1
      // }
      // },
      callback);
    },
    function(callback) {
      Weight.find({
        user : userid
      }, '_id time weight',
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
  // TODO Make it possible to get single pages
};

exports.getPages = function(req, res) {
  var userid = req.user._id;
  // Pages
};
