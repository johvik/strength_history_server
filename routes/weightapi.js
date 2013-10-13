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

function get_obj(req) {
  var time = parseInt(req.body.time, 10);
  var weight = parseFloat(req.body.weight);
  if (!isNaN(time) && !isNaN(weight)) {
    return {
      time : time,
      weight : weight
    };
  }
  return null;
}

exports.post = util.post(Weight, get_obj);

exports.put = util.put(Weight, get_obj);
