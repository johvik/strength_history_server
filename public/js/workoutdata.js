function WorkoutData() {
	// Constructor
}

WorkoutData.test = function() {
	// save -> update -> remove
	WorkoutData.save(90144124, '000000000000000000000000', [ {
		exercise : '000000000000000000000000',
		sets : [ {
			weight : 50,
			reps : 4
		}, {
			weight : 99.5,
			reps : 2
		} ]
	} ], function(err1, data1) {
		console.assert(err1 === null, err1);
		WorkoutData.update(data1, 14124124, '000000000000000000000000', [], function(err2) {
			console.assert(err2 === null, err2);
			WorkoutData.remove(data1, function(err3, data3) {
				console.assert(err3 === null, err3);
			});
		});
	});
	// save - invalid time
	WorkoutData.save('text', '000000000000000000000000', [], function(err, data) {
		console.assert(err !== null, err);
	});
	// save - invalid workout id
	WorkoutData.save(241241241, 'text', [], function(err, data) {
		console.assert(err !== null, err);
	});
	// save - invalid data
	WorkoutData.save(241241241, '000000000000000000000000', [ 'something' ], function(err, data) {
		console.assert(err !== null, err);
	});
	// remove - invalid id
	WorkoutData.remove('someid', function(err) {
		console.assert(err !== null, err);
	});
	// update - invalid id
	WorkoutData.update('someid', 4214, '000000000000000000000000', [], function(err) {
		console.assert(err !== null, err);
	});
	// save -> update -> remove - invalid stuff
	WorkoutData.save(1141421, '000000000000000000000000', [], function(err1, data1) {
		console.assert(err1 === null, err1);
		// update - invalid time
		WorkoutData.update(data1, 'text', '000000000000000000000000', [], function(err2) {
			console.assert(err2 !== null, err2);
		});
		// update - invalid workout id
		WorkoutData.update(data1, 512124, 'text', [], function(err2) {
			console.assert(err2 !== null, err2);
		});
		// update - invalid data
		WorkoutData.update(data1, 512124, '000000000000000000000000', [ 'something' ], function(err2) {
			console.assert(err2 !== null, err2);
		});
		// remove after some time
		setTimeout(function() {
			WorkoutData.remove(data1, function(err2) {
				console.assert(err2 === null, err2);
			});
		}, 500);
	});
};

WorkoutData.remove = function(id, callback) {
	return $.ajax('/workoutdata/' + id, {
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

WorkoutData.save = function(time, workout, data, callback) {
	return $.ajax('/workoutdata', {
		type : 'POST',
		data : {
			time : time,
			workout : workout,
			// fix for empty array
			data : (0 === data.length ? [ '' ] : data)
		}
	}).done(function(data2, textStatus, jqXHR) {
		if (callback) {
			callback(null, data2);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};

WorkoutData.update = function(id, time, workout, data, callback) {
	return $.ajax('/workoutdata/' + id, {
		type : 'PUT',
		data : {
			time : time,
			workout : workout,
			// fix for empty array
			data : (0 === data.length ? [ '' ] : data)
		}
	}).done(function(data2, textStatus, jqXHR) {
		if (callback) {
			callback(null, data2);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown, null);
		}
	});
};

WorkoutData.get = function(callback) {
	return $.ajax('/workoutdata', {
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

WorkoutData.getId = function(id, callback) {
	return $.ajax('/workoutdata/' + id, {
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

WorkoutData.getAll = function(each, callback) {
	// Get list with IDs
	return WorkoutData.get(function(err, data) {
		if (err !== null) {
			if (callback) {
				callback(err, null);
			}
		} else {
			// Map the array to a function array
			// Use apply to convert it to a proper call
			$.when.apply($, data.map(function(id) {
				return WorkoutData.getId(id, each);
			})).then(function() {
				if (callback) {
					callback(null, 'done');
				}
			}, function() {
				if (callback) {
					callback('fail', null);
				}
			});
		}
	});
};

WorkoutData.getPages = function(callback) {
	return $.ajax('/workoutdata/pages', {
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

WorkoutData.getPage = function(page, callback) {
	return $.ajax('/workoutdata/pages/' + page, {
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
