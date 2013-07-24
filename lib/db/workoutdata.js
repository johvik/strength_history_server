var mongoose = require('mongoose');
var mongo = require('./mongo');

var workoutDataSchema = new mongoose.Schema({
	user : {
		type : mongoose.Schema.Types.ObjectId,
		required : true
	}
}, {
	collection : 'workoutdata'
});

var WorkoutData = mongoose.model('workoutdata', workoutDataSchema);

exports.Model = WorkoutData;
