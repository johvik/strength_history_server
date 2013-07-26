var mongoose = require('mongoose');
var mongo = require('./mongo');
var WorkoutData = require('./workoutdata').Model;

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

exerciseSchema.methods.latest = function(userid, cb) {
	Exercise.latest(userid, this._id, cb);
};

exerciseSchema.statics.latest = function(userid, exerciseid, cb) {
	// Get latest with non empty sets
	WorkoutData.findOne({
		$query : {
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
		},
		$orderby : {
			time : -1
		}
	}, cb);
};

exerciseSchema.statics.addTest = function(userid) {
	new Exercise({
		name : 'Squat',
		standardIncrease : 2.5,
		user : userid
	}).save();
};

var Exercise = mongoose.model('exercise', exerciseSchema);

exports.Model = Exercise;
