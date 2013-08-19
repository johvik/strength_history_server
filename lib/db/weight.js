var mongoose = require('mongoose');
var mongo = require('./mongo');

var weightSchema = new mongoose.Schema({
  time : {
    type : Date,
    required : true
  },
  weight : {
    type : Number,
    required : true
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  }
}, {
  collection : 'weight'
});

weightSchema.statics.latest = function(userid, cb) {
  Weight.findOne({
    user : userid
  }, '_id time weight', {
    sort : {
      time : -1
    }
  }, cb);
};

weightSchema.statics.addTest = function(userid) {
  new Weight({
    time : new Date(),
    weight : 72.5,
    user : userid
  }).save();
};

var Weight = mongoose.model('weight', weightSchema);

exports.Model = Weight;
