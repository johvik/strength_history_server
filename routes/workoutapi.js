var Workout = require('../lib/db/workout').Model;
var util = require('./util');

exports.del = util.del(Workout);

exports.get = util.get(Workout, {
  name : 1
});

exports.getId = function(req, res) {
  var userid = req.user._id;
  // Get id
  var id = req.params.id;
  if (id !== undefined) {
    Workout.findOne({
      _id : id,
      user : userid
    }, Workout.publicFields, util.send400orJSON(res));
  } else {
    res.send(400);
  }
};

exports.getLatest = function(req, res) {
  var userid = req.user._id;
  // Latest id
  var id = req.params.id;
  if (id !== undefined) {
    Workout.latest(userid, id, util.send400orJSON(res));
  } else {
    res.send(400);
  }
};

exports.post = function(req, res) {
  var userid = req.user._id;
  // Save
  // body : name, exercises
  // returns id
  var name = req.body.name;
  var exercises = req.body.exercises;
  if (name !== undefined && exercises !== undefined) {
    new Workout({
      name : name,
      exercises : exercises,
      user : userid
    }).save(util.send400orID(res));
  } else {
    res.send(400);
  }
};

exports.put = function(req, res) {
  var userid = req.user._id;
  // Update id
  // body : name, exercises
  var id = req.params.id;
  var name = req.body.name;
  var exercises = req.body.exercises;
  if (id !== undefined && name !== undefined && exercises !== undefined) {
    // Find -> save to use the validation
    Workout.findOne({
      _id : id,
      user : userid
    }, Workout.publicFields, function(err, doc) {
      if (err !== null || doc === null) {
        res.send(400);
      } else {
        doc.name = name;
        doc.exercises = exercises;
        doc.save(util.send400orID(res));
      }
    });
  } else {
    res.send(400);
  }
};
