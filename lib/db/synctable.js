var mongoose = require('mongoose');
var mongo = require('./mongo');

var syncTableSchema = new mongoose.Schema({
  table : {
    type : String,
    required : true
  },
  hash : {
    type : Number,
    required : true
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  }
}, {
  collection : 'synctable'
});

function idToNumber(id) {
  // First 4 bytes and last 3 bytes are the interesting ones
  // JavaScript can't handle number larger than 13 hex chars
  // Therefore skip one hex number in the counter
  var idStr = id.toString();
  return parseInt(idStr.slice(0, 8) + idStr.slice(-5), 16);
}

syncTableSchema.statics.onAdd = function(table, user, id) {
  var idNumber = idToNumber(id);
  if (!isNaN(idNumber)) {
    SyncTable.findOne({
      table : table,
      user : user
    }, function(err, doc) {
      var hash = idNumber;
      if (doc !== null) {
        // If the db has an entry already
        hash = idNumber ^ doc.hash;
      }
      // Use existing doc or create a new entry
      var entry = doc || new SyncTable({
        table : table,
        user : user
      });
      entry.hash = hash;
      entry.save();
    });
  }
};

syncTableSchema.statics.onRemove = function(table, user, id) {
  // It is the exact same operation to remove! XOR will reverse the number
  SyncTable.onAdd(table, user, id);
};

var SyncTable = mongoose.model('sync', syncTableSchema);
SyncTable.publicFields = 'hash'; // TODO -_id ?

exports.Model = SyncTable;
