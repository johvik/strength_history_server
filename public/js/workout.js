function Workout() {
	// Constructor
}

Workout.test = function() {
	// save exercise for test
	Exercise.save('name', 2.5, function(err1, data1) {
		console.assert(err1 === null, err1);
		Workout.save('name', [ data1 ], function(err2, data2) {
			console.assert(err2 === null, err2);
			Workout.remove(data2, function(err3, data3) {
				console.assert(err3 === null, err3);
			});
		});
		// remove after some time
		setTimeout(function() {
			Exercise.remove(data1, function(err2, data2) {
				console.assert(err2 === null, err2);
			});
		}, 500);
	});

	// save -> update -> remove
	Workout.save('name', [], function(err1, data1) {
		console.assert(err1 === null, err1);
		Workout.update(data1, 'newname', [], function(err2) {
			console.assert(err2 === null, err2);
			Workout.remove(data1, function(err3, data3) {
				console.assert(err3 === null, err3);
			});
		});
	});
	// save - invalid name
	Workout.save('', [], function(err, data) {
		console.assert(err !== null, err);
	});
	// save - invalid exercises
	Workout.save('name', [ 'someid' ], function(err, data) {
		console.assert(err !== null, err);
	});
	// remove - invalid id
	Workout.remove('someid', function(err) {
		console.assert(err !== null, err);
	});
	// update - invalid id
	Workout.update('someid', 'name', [], function(err) {
		console.assert(err !== null, err);
	});
	// save -> update -> remove - invalid stuff
	Workout.save('name', [], function(err1, data1) {
		console.assert(err1 === null, err1);
		// update - invalid name
		Workout.update(data1, '', [], function(err2) {
			console.assert(err2 !== null, err2);
		});
		// update - invalid exercises
		Workout.update(data1, 'name', [ 'someid' ], function(err2) {
			console.assert(err2 !== null, err2);
		});
		// remove after some time
		setTimeout(function() {
			Workout.remove(data1, function(err2) {
				console.assert(err2 === null, err2);
			});
		}, 500);
	});
};

Workout.remove = function(id, callback) {
	$.ajax('/workout/' + id, {
		type : 'DELETE'
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown);
		}
	});
};

Workout.save = function(name, exercises, callback) {
	$.ajax('/workout', {
		type : 'POST',
		data : {
			name : name,
			// fix for empty array
			exercises : (0 === exercises.length ? [ '' ] : exercises)
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

Workout.update = function(id, name, exercises, callback) {
	$.ajax('/workout/' + id, {
		type : 'PUT',
		data : {
			name : name,
			// fix for empty array
			exercises : (0 === exercises.length ? [ '' ] : exercises)
		}
	}).done(function(data, textStatus, jqXHR) {
		if (callback) {
			callback(null);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown);
		}
	});
};

Workout.get = function(callback) {
	$.ajax('/workout', {
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

Workout.getId = function(id, callback) {
	$.ajax('/workout/' + id, {
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

Workout.getPages = function(callback) {
	$.ajax('/workout/pages', {
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

Workout.getPage = function(page, callback) {
	$.ajax('/workout/pages/' + page, {
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
