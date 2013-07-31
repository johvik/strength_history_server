function Weight() {
	// Constructor
}

Weight.test = function() {
	// save -> update -> remove
	Weight.save(90144124, 2.5, function(err1, data1) {
		console.assert(err1 === null, err1);
		Weight.update(data1, 14124124, 25.1, function(err2) {
			console.assert(err2 === null, err2);
			Weight.remove(data1, function(err3, data3) {
				console.assert(err3 === null, err3);
			});
		});
	});
	// save - invalid time
	Weight.save('text', 2.5, function(err, data) {
		console.assert(err !== null, err);
	});
	// save - invalid weight
	Weight.save(241241241, 'text', function(err, data) {
		console.assert(err !== null, err);
	});
	// remove - invalid id
	Weight.remove('someid', function(err) {
		console.assert(err !== null, err);
	});
	// update - invalid id
	Weight.update('someid', 4214, 2.5, function(err) {
		console.assert(err !== null, err);
	});
	// save -> update -> remove - invalid stuff
	Weight.save(1141421, 2.5, function(err1, data1) {
		console.assert(err1 === null, err1);
		// update - invalid time
		Weight.update(data1, 'text', 2.5, function(err2) {
			console.assert(err2 !== null, err2);
		});
		// update - invalid weight
		Weight.update(data1, 512124, 'text', function(err2) {
			console.assert(err2 !== null, err2);
		});
		// remove after some time
		setTimeout(function() {
			Weight.remove(data1, function(err2) {
				console.assert(err2 === null, err2);
			});
		}, 500);
	});
};

Weight.remove = function(id, callback) {
	$.ajax('/weight/' + id, {
		type : 'DELETE'
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null, data);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};

Weight.save = function(time, weight, callback) {
	$.ajax('/weight', {
		type : 'POST',
		data : {
			time : time,
			weight : weight
		}
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null, data);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};

Weight.update = function(id, time, weight, callback) {
	$.ajax('/weight/' + id, {
		type : 'PUT',
		data : {
			time : time,
			weight : weight
		}
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null, data);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};

Weight.get = function(callback) {
	$.ajax('/weight', {
		type : 'GET'
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null, data);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};

Weight.getId = function(id, callback) {
	$.ajax('/weight/' + id, {
		type : 'GET'
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null, data);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};

Weight.getLatest = function(callback) {
	$.ajax('/weight/latest', {
		type : 'GET'
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null, data);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};

Weight.getPages = function(callback) {
	$.ajax('/weight/pages', {
		type : 'GET'
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null, data);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};

Weight.getPage = function(page, callback) {
	$.ajax('/weight/pages/' + page, {
		type : 'GET'
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null, data);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};
