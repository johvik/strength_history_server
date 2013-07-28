var Weight = require('../lib/db/weight').Model;
var Exercise = require('../lib/db/exercise').Model;
var Workout = require('../lib/db/workout').Model;
var WorkoutData = require('../lib/db/workoutdata').Model;

exports.test = function(req, res) {
	var userid = req.user._id;
	Exercise.addTest(userid);
	//Weight.addTest(userid);
	Exercise.findOne({
		user : userid
	}, function(err, doc) {
		//console.log(err);
		//console.log(doc);
		if (doc) {
			//Workout.addTest(userid, doc._id);
		}
	});
	Workout.findOne({
		user : userid
	}, function(err1, doc1) {
		if (doc1) {
			Exercise.findOne({
				user : userid
			}, function(err2, doc2) {
				WorkoutData.addTest(userid, doc1._id, doc2._id);
				doc2.latest(userid, function(err3, doc3) {
					// console.log(doc3);
					doc1.latest(userid, function(err4, doc4) {
						//console.log(err4);
						//console.log(doc4);
						Workout.addTest(userid, doc2._id);
					});
				});
			});
		}
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
