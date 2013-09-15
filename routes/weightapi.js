var Weight = require('../lib/db/weight').Model;

exports.del = function(req, res) {
  var userid = req.user._id;
  // Remove id
  var id = req.params.id;
  if (id !== undefined) {
    Weight.remove({
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
  Weight.find({
    user : userid
  }, '_id time weight', {
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
    Weight.findOne({
      _id : id,
      user : userid
    }, '_id time weight', function(err, docs) {
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

exports.getLatest = function(req, res) {
  var userid = req.user._id;
  // Latest
  Weight.latest(userid, function(err, doc) {
    if (err !== null || doc === null) {
      res.send(400);
    } else {
      res.json(doc);
    }
  });
};

exports.post = function(req, res) {
  var userid = req.user._id;
  // Save
  // body : time, weight
  // returns id
  var time = parseInt(req.body.time, 10);
  var weight = parseFloat(req.body.weight);
  if (!isNaN(time) && !isNaN(weight)) {
    new Weight({
      time : time,
      weight : weight,
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
  // body : time, weight
  var id = req.params.id;
  var time = parseInt(req.body.time, 10);
  var weight = parseFloat(req.body.weight);
  if (id !== undefined && !isNaN(time) && !isNaN(weight)) {
    Weight.update({
      _id : id,
      user : userid
    }, {
      time : time,
      weight : weight
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
