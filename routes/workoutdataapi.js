var WorkoutData = require('../lib/db/workoutdata').Model;

exports.del = function(req, res) {
  var userid = req.user._id;
  // Remove id
  var id = req.params.id;
  if (id !== undefined) {
    WorkoutData.remove({
      _id : id,
      user : userid
    }, function(err, doc) {
      if (err !== null || doc === 0) {
        res.send(400);
      } else {
        res.send(200);
      }
    });
  } else {
    res.send(400);
  }
};

exports.get = function(req, res) {
  var userid = req.user._id;
  // Get all
  WorkoutData.find({
    user : userid
  }, WorkoutData.publicFields, {
    sort : {
      time : -1
    }
  }, function(err, docs) {
    if (err !== null || docs === null) {
      res.send(400);
    } else {
      res.json(docs);
    }
  });
};

exports.getId = function(req, res) {
  var userid = req.user._id;
  // Get id
  var id = req.params.id;
  if (id !== undefined) {
    WorkoutData.findOne({
      _id : id,
      user : userid
    }, WorkoutData.publicFields, function(err, doc) {
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

exports.post = function(req, res) {
  var userid = req.user._id;
  // Save
  // body : time, workout, data
  // returns id
  var time = parseInt(req.body.time, 10);
  var workout = req.body.workout;
  var data = req.body.data;
  if (!isNaN(time) && workout !== undefined && data !== undefined) {
    new WorkoutData({
      time : time,
      workout : workout,
      data : data,
      user : userid
    }).save(function(err, doc) {
      if (err !== null || doc === null) {
        res.send(400);
      } else {
        res.json({
          _id : doc._id
        });
      }
    });
  } else {
    res.send(400);
  }
};

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
        doc.save(function(err2, doc2) {
          if (err2 !== null || doc2 === null) {
            res.send(400);
          } else {
            res.json({
              _id : doc2._id
            });
          }
        });
      }
    });
  } else {
    res.send(400);
  }
};
