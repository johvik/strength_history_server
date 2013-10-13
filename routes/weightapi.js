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
  }, Weight.publicFields, {
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
    }, Weight.publicFields, function(err, doc) {
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
    // Find -> save to use the validation
    Weight.findOne({
      _id : id,
      user : userid
    }, Weight.publicFields, function(err, doc) {
      if (err !== null || doc === null) {
        res.send(400);
      } else {
        doc.time = time;
        doc.weight = weight;
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
