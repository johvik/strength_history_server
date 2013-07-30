$.ajax('/login', { // TODO Remove this
	type : 'POST',
	data : {
		username : 'test',
		password : 'test'
	}
});

var callback = function(err, data) { // TODO Remove this
	if (err !== null) {
		console.log(err);
	} else {
		console.log(data);
	}
};

function testAll() {
	Exercise.test();
	Weight.test();
	Workout.test();
}

$(function() {
	$('#sendexercise').click(function() {
		var id = $('#id').val();
		var name = $('#name').val();
		var standardIncrease = $('#standardIncrease').val();

		var select = $('#select').find(':selected').text();
		if (select === 'Save') {
			Exercise.save(name, standardIncrease, function(err, data) {
				if (err !== null) {
					console.log(err);
				} else {
					console.log(data);
				}
			});
		} else if (select === 'Remove') {
			Exercise.remove(id, function(err) {
				if (err !== null) {
					console.log(err);
				}
			});
		} else if (select === 'Update') {
			Exercise.update(id, name, standardIncrease, function(err) {
				if (err !== null) {
					console.log(err);
				}
			});
		}
	});
	$('#sendweight').click(function() {
		var id = $('#id').val();
		var time = $('#time').val();
		var weight = $('#weight').val();

		var select = $('#select').find(':selected').text();
		if (select === 'Save') {
			Weight.save(time, weight, function(err, data) {
				if (err !== null) {
					console.log(err);
				} else {
					console.log(data);
				}
			});
		} else if (select === 'Remove') {
			Weight.remove(id, function(err) {
				if (err !== null) {
					console.log(err);
				}
			});
		} else if (select === 'Update') {
			Weight.update(id, time, weight, function(err) {
				if (err !== null) {
					console.log(err);
				}
			});
		}
	});
	$('#sendworkout').click(function() {
		var id = $('#id').val();
		var name = $('#name').val();
		var exercises = $('#exercises').val().split(',');

		var select = $('#select').find(':selected').text();
		if (select === 'Save') {
			Workout.save(name, exercises, function(err, data) {
				if (err !== null) {
					console.log(err);
				} else {
					console.log(data);
				}
			});
		} else if (select === 'Remove') {
			Workout.remove(id, function(err) {
				if (err !== null) {
					console.log(err);
				}
			});
		} else if (select === 'Update') {
			Workout.update(id, name, exercises, function(err) {
				if (err !== null) {
					console.log(err);
				}
			});
		}
	});
	Exercise.getPages(function(err, data) {
		if (err !== null) {
			console.log(err);
		} else {
			console.log(data);
		}
	});
	Exercise.getPage(1, function(err, data) {
		if (err !== null) {
			console.log(err);
		} else {
			console.log(data);
		}
	});
	Weight.getLatest(function(err, data) {
		if (err !== null) {
			console.log(err);
		} else {
			console.log(data);
		}
	});
	Weight.getPages(function(err, data) {
		if (err !== null) {
			console.log(err);
		} else {
			console.log(data);
		}
	});
	Weight.getPage(1, function(err, data) {
		if (err !== null) {
			console.log(err);
		} else {
			console.log(data);
		}
	});
	Workout.getPages(function(err, data) {
		if (err !== null) {
			console.log(err);
		} else {
			console.log(data);
		}
	});
	Workout.getPage(1, function(err, data) {
		if (err !== null) {
			console.log(err);
		} else {
			console.log(data);
		}
	});
});
