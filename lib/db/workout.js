var mongoose = require('mongoose');
var mongo = require('./mongo');
var async = require('async');
var WorkoutData = require('./workoutdata').Model;

var workoutSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		validate : [ function(val) {
			var len = val.length;
			return len >= 1 && len <= 64;
		}, 'Name has wrong length' ]
	},
	exercises : {
		type : [ mongoose.Schema.Types.ObjectId ],
		validate : [ function(val) {
			var len = val.length;
			return len >= 0 && len <= 64;
		}, 'Exercises has wrong length' ]
	},
	user : {
		type : mongoose.Schema.Types.ObjectId,
		required : true
	}
}, {
	collection : 'workout'
});

workoutSchema.statics.latest = function(userid, workoutid, cb) {
	WorkoutData.findOne({
		user : userid,
		workout : workoutid
	}, '_id time workout data', {
		sort : {
			time : -1
		}
	}, cb);
};

workoutSchema.statics.addTest = function(userid, exerciseid) {
	new Workout({
		name : 'testname',
		exercises : [ exerciseid, exerciseid ],
		user : userid
	}).save();
};

var Workout = mongoose.model('workout', workoutSchema);

exports.Model = Workout;
