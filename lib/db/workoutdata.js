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
    type : [
      setDataSchema
    ],
    validate : [
      function(val) {
        var len = val.length;
        return len >= 0 && len <= 32;
      },
      'Sets has wrong length'
    ]
  }
}, {
  _id : false
});

var workoutDataSchema = new mongoose.Schema({
  time : {
    type : Date,
    required : true,
    get : function(date) {
      return date.getTime();
    }
  },
  workout : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  data : {
    type : [
      exerciseDataSchema
    ],
    validate : [
      function(val) {
        var len = val.length;
        return len >= 0 && len <= 64;
      },
      'Data has wrong length'
    ]
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
  collection : 'workoutdata'
});

// Make it return the date as a number for JSON
workoutDataSchema.set('toJSON', {
  getters : true,
  virtuals : false
});

var WorkoutData = mongoose.model('workoutdata', workoutDataSchema);
WorkoutData.publicFields = {
  _id : 1,
  time : 1,
  workout : 1,
  data : 1,
  sync : 1
};

exports.Model = WorkoutData;
