var Weight = require('../lib/db/weight').Model;
var util = require('./util');

exports.del = util.del(Weight);

exports.get = util.get(Weight, {
  time : -1
});

exports.getId = util.getId(Weight);

exports.getLatest = function(req, res) {
  var userid = req.user._id;
  // Latest
  Weight.latest(userid, util.send400orJSON(res));
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
    }).save(util.send400orID(res));
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
        doc.save(util.send400orID(res));
      }
    });
  } else {
    res.send(400);
  }
};
