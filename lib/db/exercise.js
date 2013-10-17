var mongoose = require('mongoose');
var mongo = require('./mongo');
var WorkoutData = require('./workoutdata').Model;

var exerciseSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    validate : [
      function(val) {
        var len = val.length;
        return len >= 1 && len <= 64;
      },
      'Name has wrong length'
    ]
  },
  standardIncrease : {
    type : Number,
    required : true
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  sync : {
    type : Date,
    required : true,
    get : function(date) {
      return date.getTime();
    }
  }
}, {
  collection : 'exercise'
});

// Make it return the date as a number for JSON
exerciseSchema.set('toJSON', {
  getters : true,
  virtuals : false
});

exerciseSchema.methods.latest = function(userid, cb) {
  Exercise.latest(userid, this._id, cb);
};

exerciseSchema.statics.latest = function(userid, exerciseid, cb) {
  // Get latest with non empty sets
  WorkoutData.findOne({
    user : userid,
    data : {
      $elemMatch : {
        exercise : exerciseid,
        sets : {
          $not : {
            $size : 0
          }
        }
      }
    }
  }, WorkoutData.publicFields, {
    sort : {
      time : -1,
      sync : -1
    }
  }, cb);
};

var Exercise = mongoose.model('exercise', exerciseSchema);
Exercise.publicFields = '_id name standardIncrease sync';

exports.Model = Exercise;
