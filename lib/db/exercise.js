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
  }
}, {
  collection : 'exercise'
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
      time : -1
    }
  }, cb);
};

var Exercise = mongoose.model('exercise', exerciseSchema);
Exercise.publicFields = '_id name standardIncrease';

exports.Model = Exercise;
