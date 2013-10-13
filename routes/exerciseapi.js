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

function get_obj(req) {
  var name = req.body.name;
  var standardIncrease = parseFloat(req.body.standardIncrease);
  if (name !== undefined && !isNaN(standardIncrease)) {
    return {
      name : name,
      standardIncrease : standardIncrease
    };
  }
  return null;
}

exports.post = util.post(Exercise, get_obj);

exports.put = util.put(Exercise, get_obj);
