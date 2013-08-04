var Exercise = require('../lib/db/exercise').Model;

exports.del = function(req, res) {
	var userid = req.user._id;
	// Remove id
	var id = req.params.id;
	if (id !== undefined) {
		Exercise.remove({
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
	Exercise.find({
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
		Exercise.findOne({
			_id : id,
			user : userid
		}, '_id name standardIncrease', function(err, docs) {
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

exports.getLatest = function(req, res) {
	var userid = req.user._id;
	// Latest id
	var id = req.params.id;
	if (id !== undefined) {
		Exercise.latest(userid, id, function(err, doc) {
			if (err !== null || doc === null) {
				res.send(400);
			} else {
				res.json(doc);
			}
		});
	} else {
		res.send(400);
	}
};

exports.getAll = function(req, res) {
	var userid = req.user._id;
	Exercise.find({
		user : userid
	}, '_id name standardIncrease', {
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
};

exports.post = function(req, res) {
	var userid = req.user._id;
	// Save
	// body : name, standardIncrease
	// returns id
	var name = req.body.name;
	var standardIncrease = parseFloat(req.body.standardIncrease);
	if (name !== undefined && !isNaN(standardIncrease)) {
		new Exercise({
			name : name,
			standardIncrease : standardIncrease,
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
	var userid = req.user._id;
	// Update id
	// body : name, standardIncrease
	var id = req.params.id;
	var name = req.body.name;
	var standardIncrease = parseFloat(req.body.standardIncrease);
	if (id !== undefined && name !== undefined && !isNaN(standardIncrease)) {
		Exercise.update({
			_id : id,
			user : userid
		}, {
			name : name,
			standardIncrease : standardIncrease
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
