var Exercise = require('../lib/db/exercise').Model;
var util = require('./util');

exports.del = util.del(Exercise);

exports.get = util.get(Exercise, {
  name : 1
});

exports.getId = util.getId(Exercise);

exports.getLatest = function(req, res) {
  var userid = req.user._id;
  // Latest id
  var id = req.params.id;
  if (id !== undefined) {
    Exercise.latest(userid, id, util.send400orJSON(res));
  } else {
    res.send(400);
  }
};

exports.post = util.post(Exercise, function(req) {
  var name = req.body.name;
  var standardIncrease = parseFloat(req.body.standardIncrease);
  if (name !== undefined && !isNaN(standardIncrease)) {
    return {
      name : name,
      standardIncrease : standardIncrease
    };
  }
  return null;
});

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
        doc.save(util.send400orID(res));
      }
    });
  } else {
    res.send(400);
  }
};
