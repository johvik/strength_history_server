var Weight = require('../lib/db/weight').Model;
var Exercise = require('../lib/db/exercise').Model;
var Workout = require('../lib/db/workout').Model;
var WorkoutData = require('../lib/db/workoutdata').Model;

exports.test = function(req, res) {
	var userid = req.user._id;
	Workout.findOne({
		user : userid
	}, function(err1, doc1) {
		Exercise.findOne({
			user : userid
		}, function(err2, doc2) {
			WorkoutData.addTest(userid, doc1._id, doc2._id);
			doc2.latest(userid, function(err3, doc3) {
				console.log(doc3);
			});
		});
	});
	Weight.latest(userid, function(err, doc) {
		if (doc) {
			// console.log(doc);
		} else {
			Weight.addTest(userid);
			Exercise.addTest(userid);
			Workout.addTest(userid);
		}
	});
	Weight.find({
		user : userid
	}, function(err, docs) {
		res.send('Hello ' + req.user.username + '! ' + docs);
	});
};
