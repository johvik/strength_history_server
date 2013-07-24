var mongoose = require('mongoose');
var mongo = require('./mongo');

var weightSchema = new mongoose.Schema({
	time : {
		type : Date,
		required : true
	},
	weight : {
		type : Number,
		required : true
	},
	user : {
		type : mongoose.Schema.Types.ObjectId,
		required : true
	}
}, {
	collection : 'weight'
});

weightSchema.statics.latest = function(user, cb) {
	Weight.findOne({
		$query : {
			user : user
		},
		$orderby : {
			time : -1
		}
	}, cb);
};

weightSchema.statics.addTest = function(user) {
	new Weight({
		time : new Date(),
		weight : 72.5,
		user : user
	}).save();
};

var Weight = mongoose.model('weight', weightSchema);

exports.Model = Weight;
