function Workout() {
	// Constructor
}

Workout.test = function() {
	// save -> update -> remove
	Workout.save('name', [ '000000000000000000000000' ], function(err1, data1) {
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
	return $.ajax('/workout/' + id, {
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

Workout.save = function(name, exercises, callback) {
	return $.ajax('/workout', {
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
	return $.ajax('/workout/' + id, {
		type : 'PUT',
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

Workout.get = function(callback) {
	return $.ajax('/workout', {
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
	return $.ajax('/workout/' + id, {
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

Workout.getAll = function(each) {
	var deferred = $.Deferred();
	// Get list with IDs
	Workout.get(function(err, data) {
		if (err !== null) {
			deferred.reject();
		} else {
			// Map the array to a function array
			// Use apply to convert it to a proper call
			$.when.apply($, data.map(function(id) {
				return Workout.getId(id, each);
			})).then(function() {
				deferred.resolve();
			}, function() {
				deferred.reject();
			});
		}
	});
	return deferred.promise();
};

Workout.getPages = function(callback) {
	return $.ajax('/workout/pages', {
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
	return $.ajax('/workout/pages/' + page, {
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
