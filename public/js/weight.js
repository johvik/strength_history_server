function Weight() {
	// Constructor
}

Weight.remove = function(id, callback) {
	$.ajax('/weight/' + id, {
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
			callback(null);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (callback) {
			callback(errorThrown);
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
