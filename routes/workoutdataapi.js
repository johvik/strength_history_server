var WorkoutData = require('../lib/db/workoutdata').Model;
var util = require('./util');

exports.del = util.del(WorkoutData);

exports.get = util.get(WorkoutData, {
  time : -1
});

exports.getId = util.getId(WorkoutData);

exports.post = util.post(WorkoutData, function(req) {
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
});

exports.put = function(req, res) {
  var userid = req.user._id;
  // Update id
  // body : time, workout, data
  var id = req.params.id;
  var time = parseInt(req.body.time, 10);
  var workout = req.body.workout;
  var data = req.body.data;
  if (id !== undefined && !isNaN(time) && workout !== undefined && data !== undefined) {
    // Find -> save to use the validation
    WorkoutData.findOne({
      _id : id,
      user : userid
    }, WorkoutData.publicFields, function(err, doc) {
      if (err !== null || doc === null) {
        res.send(400);
      } else {
        doc.time = time;
        doc.workout = workout;
        doc.data = data;
        doc.save(util.send400orID(res));
      }
    });
  } else {
    res.send(400);
  }
};
