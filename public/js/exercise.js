function Exercise() {
	// Constructor
}

Exercise.test = function() {
	// save -> update -> remove
	Exercise.save('name', 2.5, function(err1, data1) {
		console.assert(err1 === null, err1);
		Exercise.update(data1, 'newname', 5.2, function(err2) {
			console.assert(err2 === null, err2);
			Exercise.remove(data1, function(err3, data3) {
				console.assert(err3 === null, err3);
			});
		});
	});
	// save - invalid name
	Exercise.save('', 2.5, function(err, data) {
		console.assert(err !== null, err);
	});
	// save - invalid standardIncrease
	Exercise.save('name', 'text', function(err, data) {
		console.assert(err !== null, err);
	});
	// remove - invalid id
	Exercise.remove('someid', function(err) {
		console.assert(err !== null, err);
	});
	// update - invalid id
	Exercise.update('someid', 'name', 2.5, function(err) {
		console.assert(err !== null, err);
	});
	// save -> update -> remove - invalid stuff
	Exercise.save('name', 2.5, function(err1, data1) {
		console.assert(err1 === null, err1);
		// update - invalid name
		Exercise.update(data1, '', 2.5, function(err2) {
			console.assert(err2 !== null, err2);
		});
		// update - invalid standardIncrease
		Exercise.update(data1, 'name', 'text', function(err2) {
			console.assert(err2 !== null, err2);
		});
		// remove after some time
		setTimeout(function() {
			Exercise.remove(data1, function(err2) {
				console.assert(err2 === null, err2);
			});
		}, 500);
	});
};

Exercise.remove = function(id, callback) {
	$.ajax('/exercise/' + id, {
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

Exercise.save = function(name, standardIncrease, callback) {
	$.ajax('/exercise', {
		type : 'POST',
		data : {
			name : name,
			standardIncrease : standardIncrease
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

Exercise.update = function(id, name, standardIncrease, callback) {
	$.ajax('/exercise/' + id, {
		type : 'PUT',
		data : {
			name : name,
			standardIncrease : standardIncrease
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

Exercise.get = function(callback) {
	$.ajax('/exercise', {
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

Exercise.getId = function(id, callback) {
	$.ajax('/exercise/' + id, {
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

Exercise.getLatest = function(id, callback) {
	$.ajax('/exercise/latest/' + id, {
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

Exercise.getPages = function(callback) {
	$.ajax('/exercise/pages', {
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

Exercise.getPage = function(page, callback) {
	$.ajax('/exercise/pages/' + page, {
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
