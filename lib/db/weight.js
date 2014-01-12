var mongoose = require('mongoose');
var mongo = require('./mongo');

var Weight;
var weightSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
    get: function(date) {
      return date.getTime();
    }
  },
  weight: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  sync: {
    type: Date,
    required: true,
    get: function(date) {
      return date.getTime();
    }
  }
}, {
  collection: 'weight'
});

// Make it return the date as a number for JSON
weightSchema.set('toJSON', {
  getters: true,
  virtuals: false
});

weightSchema.statics.latest = function(userid, cb) {
  Weight.findOne({
    user: userid
  }, Weight.publicFields, {
    sort: {
      time: -1,
      sync: -1
    }
  }, cb);
};

Weight = mongoose.model('weight', weightSchema);
Weight.publicFields = {
  _id: 1,
  time: 1,
  weight: 1,
  sync: 1
};

exports.Model = Weight;
