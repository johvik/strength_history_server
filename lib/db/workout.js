var mongoose = require('mongoose');
var mongo = require('./mongo');
var WorkoutData = require('./workoutdata').Model;

var workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: [

      function(val) {
        var len = val.length;
        return len >= 1 && len <= 64;
      },
      'Name has wrong length'
    ]
  },
  exercises: {
    type: [
      mongoose.Schema.Types.ObjectId
    ],
    validate: [

      function(val) {
        var len = val.length;
        return len >= 0 && len <= 64;
      },
      'Exercises has wrong length'
    ]
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
  collection: 'workout'
});

// Make it return the date as a number for JSON
workoutSchema.set('toJSON', {
  getters: true,
  virtuals: false
});

workoutSchema.statics.latest = function(userid, workoutid, cb) {
  WorkoutData.findOne({
    user: userid,
    workout: workoutid
  }, WorkoutData.publicFields, {
    sort: {
      time: -1,
      sync: -1
    }
  }, cb);
};

var Workout = mongoose.model('workout', workoutSchema);
Workout.publicFields = {
  _id: 1,
  name: 1,
  exercises: 1,
  sync: 1
};

exports.Model = Workout;
