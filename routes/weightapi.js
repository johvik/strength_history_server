var Weight = require('../lib/db/weight').Model;
var pageSize = 20;

exports.get = function(req, res) {
	// TODO Change stuff to PUT / DELETE? and change the request paths
	var userid = req.user._id;
	if (req.query.latest === '') {
		// ?latest
		Weight.latest(userid, function(err, doc) {
			if (err !== null) {
				res.send(500);
			} else if (doc === null) {
				res.send(400);
			} else {
				res.json(doc);
			}
		});
	} else if (req.query.pages === '') {
		// ?pages
		Weight.count({
			user : userid
		}, function(err, doc) {
			if (err !== null) {
				res.send(500);
			} else {
				var pages = Math.max(1, Math.ceil(doc / pageSize));
				res.json(pages);
			}
		});
	} else if (req.query.query === '') {
		// ?query&page=x
		var page = parseInt(req.query.page, 10);
		if (!isNaN(page) && page >= 1) {
			Weight.find({
				user : userid
			}, '_id time weight', {
				limit : pageSize,
				skip : (page - 1) * pageSize
			}, function(err, docs) {
				if (err !== null) {
					res.send(500);
				} else if (docs === null) {
					res.send(400);
				} else {
					res.json(docs);
				}
			});
		} else {
			res.send(400);
		}
	} else {
		res.send(404);
	}
};

exports.post = function(req, res) {
	var userid = req.user._id;
	if (req.query.remove === '') {
		// ?remove
		// body : id
		var id = req.body.id;
		if (id !== undefined) {
			Weight.remove({
				_id : id,
				user : userid
			}, function(err, doc) {
				if (err !== null) {
					res.send(500);
				} else if (doc === 0) {
					res.send(400);
				} else {
					res.send(200);
				}
			});
		} else {
			res.send(400);
		}
	} else if (req.query.save === '') {
		// ?save
		// body : time, weight
		// returns id
		var time = parseInt(req.body.time, 10);
		var weight = parseFloat(req.body.weight);
		if (!isNaN(time) && !isNaN(weight)) {
			new Weight({
				time : time,
				weight : weight,
				user : userid
			}).save(function(err, doc) {
				if (err !== null) {
					res.send(500);
				} else if (doc === null) {
					res.send(400);
				} else {
					res.json(doc._id);
				}
			});
		} else {
			res.send(400);
		}
	} else if (req.query.update === '') {
		// ?update
		// body : id, time, weight
		var id2 = req.body.id;
		var time2 = parseInt(req.body.time, 10);
		var weight2 = parseFloat(req.body.weight);
		if (id2 !== undefined && !isNaN(time2) && !isNaN(weight2)) {
			Weight.update({
				_id : id2,
				user : userid
			}, {
				time : time2,
				weight : weight2
			}, function(err, doc) {
				if (err !== null) {
					res.send(500);
				} else if (doc === 0) {
					res.send(400);
				} else {
					res.send(200);
				}
			});
		} else {
			res.send(400);
		}
	} else {
		res.send(404);
	}
};
