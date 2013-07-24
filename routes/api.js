var Weight = require('../lib/db/weight').Model;
var Exercise = require('../lib/db/exercise').Model;
var Workout = require('../lib/db/workout').Model;

exports.test = function(req, res) {
	Weight.latest(req.user._id, function(err, doc) {
		console.log(doc);
	});
	// Weight.addTest(req.user._id);
	// Exercise.addTest(req.user._id);
	// Workout.addTest(req.user._id);
	Weight.find({
		user : req.user._id
	}, function(err, docs) {
		res.send('Hello ' + req.user.username + '! ' + docs);
	});
};
