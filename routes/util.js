/**
 * If err isn't null or doc is null 400 is sent to res. Otherwise doc is sent via json to res.
 * 
 * @returns Returns a function that accepts two arguments err and doc.
 */
exports.send400orJSON = function(res) {
  return function(err, doc) {
    if (err !== null || doc === null) {
      res.send(400);
    } else {
      res.json(doc);
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
      }, exports.send400orJSON(res));
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

/**
 * Finds id in Schema for the current user
 * 
 * @param Schema
 *          The database model to get
 */
exports.getId = function(Schema) {
  return function(req, res) {
    var userid = req.user._id;
    // Get id
    var id = req.params.id;
    if (id !== undefined) {
      Schema.findOne({
        _id : id,
        user : userid
      }, Schema.publicFields, exports.send400orJSON(res));
    } else {
      res.send(400);
    }
  };
};

/**
 * Saves the object from get_obj in Schema for the current user
 * 
 * @param Schema
 *          The database model to get
 * @param get_obj
 *          Function that takes one argument (request) and returns the object or null
 */
exports.post = function(Schema, get_obj) {
  return function(req, res) {
    var userid = req.user._id;
    // Save sync
    var sync = parseInt(req.body.sync, 10);
    var obj = get_obj(req);
    if (!isNaN(sync) && obj !== null) {
      obj.user = userid;
      var now = new Date().getTime();
      // Use body data if it is less than current time.
      obj.sync = (sync < now) ? sync : now;
      new Schema(obj).save(exports.send400orJSON(res));
    } else {
      res.send(400);
    }
  };
};

/**
 * Updates the object from get_obj and ID in Schema for the current user
 * 
 * @param Schema
 *          The database model to get
 * @param get_obj
 *          Function that takes one argument (request) and returns the object or null
 */
exports.put = function(Schema, get_obj) {
  return function(req, res) {
    var userid = req.user._id;
    // Update id sync
    var id = req.params.id;
    var sync = parseInt(req.body.sync, 10);
    var obj = get_obj(req);
    if (id !== undefined && !isNaN(sync) && obj != null) {
      // Find -> save to use the validation
      Schema.findOne({
        _id : id,
        user : userid
      }, Schema.publicFields, function(err, doc) {
        if (err !== null || doc === null) {
          res.send(400);
        } else {
          var now = new Date().getTime();
          // Use body data if it is less than current time.
          sync = (sync < now) ? sync : now;
          if (sync > doc.sync) {
            // Update if new sync time is greater than the previous one
            obj.sync = sync;
            doc.set(obj);
            doc.save(exports.send400orJSON(res));
          } else {
            // Someone else updated the data before it was synced
            // Send back the newer data
            res.json(doc);
          }
        }
      });
    } else {
      res.send(400);
    }
  };
};
