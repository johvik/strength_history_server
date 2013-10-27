var Workout = require('../db/workout').Model;
var util = require('./util');

exports.del = util.del(Workout);

exports.get = util.get(Workout, {
  name : 1
});

exports.getId = util.getId(Workout);

exports.getLatest = function(req, res) {
  var userid = req.user._id;
  // Latest id
  var id = req.params.id;
  if (id !== undefined) {
    Workout.latest(userid, id, function(err, doc) {
      if (err !== null || doc === null) {
        res.send(400);
      } else {
        res.json(doc);
      }
    });
  } else {
    res.send(400);
  }
};

function get_obj(req) {
  var name = req.body.name;
  var exercises = req.body.exercises;
  if (name !== undefined && exercises !== undefined) {
    return {
      name : name,
      exercises : exercises
    };
  }
  return null;
}

exports.post = util.post(Workout, get_obj);

exports.put = util.put(Workout, get_obj);
