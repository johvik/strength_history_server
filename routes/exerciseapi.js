var Exercise = require('../lib/db/exercise').Model;

exports.del = function(req, res) {
  var userid = req.user._id;
  // Remove id
  var id = req.params.id;
  if (id !== undefined) {
    Exercise.remove({
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
  Exercise.find({
    user : userid
  }, Exercise.publicFields, {
    sort : {
      name : 1
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
    Exercise.findOne({
      _id : id,
      user : userid
    }, Exercise.publicFields, function(err, doc) {
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
  // Latest id
  var id = req.params.id;
  if (id !== undefined) {
    Exercise.latest(userid, id, function(err, doc) {
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
  // body : name, standardIncrease
  // returns id
  var name = req.body.name;
  var standardIncrease = parseFloat(req.body.standardIncrease);
  if (name !== undefined && !isNaN(standardIncrease)) {
    new Exercise({
      name : name,
      standardIncrease : standardIncrease,
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
  // body : name, standardIncrease
  var id = req.params.id;
  var name = req.body.name;
  var standardIncrease = parseFloat(req.body.standardIncrease);
  if (id !== undefined && name !== undefined && !isNaN(standardIncrease)) {
    // Find -> save to use the validation
    Exercise.findOne({
      _id : id,
      user : userid
    }, Exercise.publicFields, function(err, doc) {
      if (err !== null || doc === null) {
        res.send(400);
      } else {
        doc.name = name;
        doc.standardIncrease = standardIncrease;
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
