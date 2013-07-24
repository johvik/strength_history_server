var mongoose = require('mongoose');
var mongo = require('./mongo');

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

workoutSchema.statics.addTest = function(user) {
	new Workout({
		name : 'testname',
		exercises : [],
		user : user
	}).save();
};

var Workout = mongoose.model('workout', workoutSchema);

exports.Model = Workout;