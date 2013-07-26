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

exerciseSchema.statics.addTest = function(userid) {
	new Exercise({
		name : 'Squat',
		standardIncrease : 2.5,
		user : userid
	}).save();
};

var Exercise = mongoose.model('exercise', exerciseSchema);

exports.Model = Exercise;
