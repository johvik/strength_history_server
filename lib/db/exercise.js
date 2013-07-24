var mongoose = require('mongoose');
var mongo = require('./mongo');

var exerciseSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
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

exerciseSchema.statics.addTest = function(user) {
	new Exercise({
		name : 'Squat',
		standardIncrease : 2.5,
		user : user
	}).save();
};

var Exercise = mongoose.model('exercise', exerciseSchema);

exports.Model = Exercise;