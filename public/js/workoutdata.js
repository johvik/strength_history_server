function WorkoutData() {
	// Constructor
}

WorkoutData.test = function() {
	// TODO Add tests
};

WorkoutData.remove = function(id, callback) {
	$.ajax('/workoutdata/' + id, {
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
	$.ajax('/workoutdata', {
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
	$.ajax('/workoutdata/' + id, {
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
	$.ajax('/workoutdata', {
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
	$.ajax('/workoutdata/' + id, {
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

WorkoutData.getPages = function(callback) {
	$.ajax('/workoutdata/pages', {
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
	$.ajax('/workoutdata/pages/' + page, {
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
