var Weight = require('../db/weight').Model;
var util = require('./util');

exports.del = util.del(Weight);

exports.get = util.get(Weight, {
  time: -1
});

exports.getId = util.getId(Weight);

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

function get_obj(req) {
  var time = parseInt(req.body.time, 10);
  var weight = parseFloat(req.body.weight);
  if (!isNaN(time) && !isNaN(weight)) {
    return {
      time: time,
      weight: weight
    };
  }
  return null;
}

exports.post = util.post(Weight, get_obj);

exports.put = util.put(Weight, get_obj);
