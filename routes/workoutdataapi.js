var WorkoutData = require('../lib/db/workoutdata').Model;
var util = require('./util');

exports.del = util.del(WorkoutData);

exports.get = util.get(WorkoutData, {
  time : -1
});

exports.getId = util.getId(WorkoutData);

function get_obj(req) {
  var time = parseInt(req.body.time, 10);
  var workout = req.body.workout;
  var data = req.body.data;
  if (!isNaN(time) && workout !== undefined && data !== undefined) {
    return {
      time : time,
      workout : workout,
      data : data
    };
  }
  return null;
}

exports.post = util.post(WorkoutData, get_obj);

exports.put = util.put(WorkoutData, get_obj);
