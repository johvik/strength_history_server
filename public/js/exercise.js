function Exercise() {
	// Constructor
}

Exercise.remove = function(id, callback) {
	$.ajax('/exercise/' + id, {
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
			callback(null);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown);
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
