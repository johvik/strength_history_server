var Exercise = require('../lib/db/exercise').Model;
var pageSize = 20;

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

exports.getPage = function(req, res) {
	var userid = req.user._id;
	// Pages id
	var page = parseInt(req.params.id, 10);
	if (!isNaN(page) && page >= 1) {
		Exercise.find({
			user : userid
		}, '_id name standardIncrease', {
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
	Exercise.count({
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
