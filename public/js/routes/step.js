function Step() {
	// Constructor
}

var stepData = null;

Step.init = function(workout) {
	stepData = {
		index : 0,
		name : workout.name,
		exercises : workout.exercises
	};
};

Step.show = function() {
	hideAll();
	setPage(stepData.name);
	$('#step_content').show();
	Step.update();
};

Step.hide = function() {
	$('#step_content').hide();
};

Step.update = function() {
	var len = stepData.exercises.length;
	if (stepData.index < len) {
		var exercise = stepData.exercises[stepData.index];
		console.log(exercise);
	}
	console.log('update');
};
