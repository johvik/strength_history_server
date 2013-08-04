var workouts = [];
var exercises = [];

var latestWorkouts = [];

$(function() {
	// Main.show();
});

function setPage(page) {
	$('#page').text(page);
}

function onWorkoutClick(id) {
	return function() {
		console.log(workouts[id]);
		return false;
	};
}

function workoutLatestCallback(err, data) {
	if (err === null) {
		latestWorkouts[data.workout] = data;
		Main.latest(data);
	}
}

$.when(Workout.getAll(function(err, data) {
	workouts = [];
	if (err === null) {
		var len = data.length;
		for ( var i = 0; i < len; i++) {
			var data_i = data[i];
			var id = data_i._id;
			workouts[id] = data_i;
			Workout.getLatest(id, workoutLatestCallback);
		}
	}
}), Exercise.getAll(function(err, data) {
	exercises = [];
	if (err === null) {
		var len = data.length;
		for ( var i = 0; i < len; i++) {
			var data_i = data[i];
			exercises[data_i._id] = data_i;
		}
	}
})).done(function() {
	Main.show();
});

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
	WorkoutData.test();
}
