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

/**
 * Delete by id in Schema for the current user
 * 
 * @param Schema
 *          The database model to get
 */
exports.del = function(Schema) {
  return function(req, res) {
    var userid = req.user._id;
    // Remove id
    var id = req.params.id;
    if (id !== undefined) {
      Schema.remove({
        _id : id,
        user : userid
      }, exports.send400orID(res));
    } else {
      res.send(400);
    }
  };
};

/**
 * Finds all in Schema for the current user
 * 
 * @param Schema
 *          The database model to get
 * @param sort
 *          Object describing the sort order
 */
exports.get = function(Schema, sort) {
  return function(req, res) {
    var userid = req.user._id;
    // Get all
    Schema.find({
      user : userid
    }, Schema.publicFields, {
      sort : sort
    }, exports.send400orJSON(res));
  };
};
