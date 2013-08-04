function Main() {
	// Constructor
}

function onWorkoutClick(id) {
	console.log(workouts[id]);
}

Main.show = function() {
	setPage('Main');
	$('#main_content').show();
	Main.update();
};

Main.update = function() {
	var main_workouts = $('#main_workouts');
	main_workouts.empty();
	var empty = true;
	for ( var id in workouts) {
		empty = false;
		var workout = workouts[id];
		main_workouts.append($('<a>', {
			class : 'workout',
			id : id,
			text : workout.name,
			href : '',
			click : onWorkoutClick(id)
		}).append($('<div>', {
			class : 'latest'
		})));
	}
	if (empty === true) {
		main_workouts.text('No workouts found.');
	}
};

Main.latest = function(data) {
	var new_id = data.workout;
	var new_a = $('#' + new_id);
	var new_date = new Date(data.time);
	var new_time = new_date.getTime();
	new_a.find('.latest').text(new_date.toUTCString());
	var list = $('#main_workouts').children('a');
	var prev = null;
	// Move to the correct place
	list.each(function() {
		var other_id = $(this).attr('id');
		if (other_id !== new_id) { // Don't compare to self!
			var other_data = latestWorkouts[other_id];
			if (other_data) {
				var other_time = new Date(other_data.time).getTime();
				if (other_time > new_time) {
					new_a.insertBefore($(this));
					prev = null;
					return false; // break
				}
			}
			prev = $(this);
		}
	});
	if (prev) {
		// Move last if time is the biggest
		new_a.insertAfter(prev);
	}
};
