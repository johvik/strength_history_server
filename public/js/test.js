$(function() {
	$('#send').click(function() {
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
});
