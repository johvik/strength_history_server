var WorkoutData = require('../lib/db/workoutdata').Model;
var pageSize = 20;

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
  }, '_id time workout data', {
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
    }, '_id time workout data', function(err, docs) {
      if (err !== null || docs === null) {
        res.send(400);
      } else {
        res.json(docs);
      }
    });
  } else {
    res.send(400);
  }
};

exports.getPage = function(req, res) {
  var userid = req.user._id;
  // Pages id
  var page = parseInt(req.params.id, 10);
  if (!isNaN(page) && page >= 1) {
    WorkoutData.find({
      user : userid
    }, '_id time workout data', {
      limit : pageSize,
      skip : (page - 1) * pageSize,
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
  } else {
    res.send(400);
  }
};

exports.getPages = function(req, res) {
  var userid = req.user._id;
  // Pages
  WorkoutData.count({
    user : userid
  }, function(err, doc) {
    if (err !== null) {
      res.send(400);
    } else {
      var pages = Math.max(1, Math.ceil(doc / pageSize));
      res.json(pages);
    }
  });
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
    WorkoutData.update({
      _id : id,
      user : userid
    }, {
      time : time,
      workout : workout,
      data : data
    }, function(err, doc) {
      if (err !== null || doc === 0) {
        res.send(400);
      } else {
        res.json({
          _id : id
        });
      }
    });
  } else {
    res.send(400);
  }
};
