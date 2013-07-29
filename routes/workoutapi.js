var Workout = require('../lib/db/workout').Model;
var pageSize = 20;

exports.del = function(req, res) {
	var userid = req.user._id;
	// Remove id
	var id = req.params.id;
	if (id !== undefined) {
		Workout.remove({
			_id : id,
			user : userid
		}, function(err, doc) {
			if (err !== null || doc === 0) {
				res.send(400);
			} else {
				res.send(200);
			}
		});
	} else {
		res.send(400);
	}
};

exports.get = function(req, res) {
	var userid = req.user._id;
	// Get all
	Workout.find({
		user : userid
	}, '_id', {
		sort : {
			name : 1
		}
	}, function(err, docs) {
		if (err !== null || docs === null) {
			res.send(400);
		} else {
			var array = [];
			for ( var i = 0, j = docs.length; i < j; i += 1) {
				array.push(docs[i]._id);
			}
			res.json(array);
		}
	});
};

exports.getId = function(req, res) {
	var userid = req.user._id;
	// Get id
	var id = req.params.id;
	if (id !== undefined) {
		Workout.findOne({
			_id : id,
			user : userid
		}, '_id name exercises', function(err, docs) {
			if (err !== null || docs === null) {
				res.send(400);
			} else {
				res.json(docs);
			}
		});
	} else {
		res.send(400);
	}
};

exports.getPage = function(req, res) {
	var userid = req.user._id;
	// Pages id
	var page = parseInt(req.params.id, 10);
	if (!isNaN(page) && page >= 1) {
		Workout.find({
			user : userid
		}, '_id name exercises', {
			limit : pageSize,
			skip : (page - 1) * pageSize,
			sort : {
				name : 1
			}
		}, function(err, docs) {
			if (err !== null || docs === null) {
				res.send(400);
			} else {
				res.json(docs);
			}
		});
	} else {
		res.send(400);
	}
};

exports.getPages = function(req, res) {
	var userid = req.user._id;
	// Pages
	Workout.count({
		user : userid
	}, function(err, doc) {
		if (err !== null) {
			res.send(400);
		} else {
			var pages = Math.max(1, Math.ceil(doc / pageSize));
			res.json(pages);
		}
	});
};

exports.post = function(req, res) {
	var userid = req.user._id;
	// Save
	// body : name, exercises
	// returns id
	var name = req.body.name;
	var exercises = req.body.exercises;
	if (name !== undefined && exercises !== undefined) {
		new Workout({
			name : name,
			exercises : exercises,
			user : userid
		}).save(function(err, doc) {
			if (err !== null || doc === null) {
				res.send(400);
			} else {
				res.json(doc._id);
			}
		});
	} else {
		res.send(400);
	}
};

exports.put = function(req, res) {
	// TODO Fix validation for all .update!
	var userid = req.user._id;
	// Update id
	// body : name, exercises
	var id = req.params.id;
	var name = req.body.name;
	var exercises = req.body.exercises;
	if (id !== undefined && name !== undefined && exercises !== undefined) {
		Workout.update({
			_id : id,
			user : userid
		}, {
			name : name,
			exercises : exercises
		}, function(err, doc) {
			if (err !== null || doc === 0) {
				res.send(400);
			} else {
				res.send(200);
			}
		});
	} else {
		res.send(400);
	}
};
