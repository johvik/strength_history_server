exports.send400or200 = function(res) {
  return function(err, doc) {
    if (err !== null || doc === 0) {
      res.send(400);
    } else {
      res.send(200);
    }
  };
};

exports.send400orJSON = function(res) {
  return function(err, doc) {
    if (err !== null || doc === null) {
      res.send(400);
    } else {
      res.json(doc);
    }
  };
};

exports.send400orID = function(res) {
  return function(err, doc) {
    if (err !== null || doc === null) {
      res.send(400);
    } else {
      res.json({
        _id : doc._id
      });
    }
  };
};
