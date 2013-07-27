var mongoose = require('mongoose');
var mongo = require('./mongo');
var async = require('async');
var Exercise = require('./exercise').Model;

var workoutSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	exercises : {
		type : [ mongoose.Schema.Types.ObjectId ]
	},
	user : {
		type : mongoose.Schema.Types.ObjectId,
		required : true
	}
}, {
	collection : 'workout'
});

workoutSchema.methods.latest = function(userid, cb) {
	async.map(this.exercises, function(exerciseid, callback) {
		Exercise.latest(userid, exerciseid, callback);
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
