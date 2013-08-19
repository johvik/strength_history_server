var mongoose = require('mongoose');
var mongo = require('./mongo');

var setDataSchema = new mongoose.Schema({
  weight : {
    type : Number,
    required : true
  },
  reps : {
    type : Number,
    required : true
  }
}, {
  _id : false
});

var exerciseDataSchema = new mongoose.Schema({
  exercise : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  sets : {
    type : [ setDataSchema ],
    validate : [ function(val) {
      var len = val.length;
      return len >= 0 && len <= 32;
    }, 'Sets has wrong length' ]
  }
}, {
  _id : false
});

var workoutDataSchema = new mongoose.Schema({
  time : {
    type : Date,
    required : true
  },
  workout : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  data : {
    type : [ exerciseDataSchema ],
    validate : [ function(val) {
      var len = val.length;
      return len >= 0 && len <= 64;
    }, 'Data has wrong length' ]
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  }
}, {
  collection : 'workoutdata'
});

workoutDataSchema.statics.addTest = function(userid, workoutid, exerciseid) {
  new WorkoutData({
    time : new Date(),
    workout : workoutid,
    data : [ {
      exercise : exerciseid,
      sets : [ {
        weight : 52,
        reps : 5
      }, {
        weight : 56,
        reps : 4
      } ]
    } ],
    user : userid
  }).save();
};

var WorkoutData = mongoose.model('workoutdata', workoutDataSchema);

exports.Model = WorkoutData;
