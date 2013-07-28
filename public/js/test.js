$(function() {
	$('#send').click(function() {
		var id = $('#id').val();
		var time = $('#time').val();
		var weight = $('#weight').val();

		var select = $('#select').find(':selected').text();
		if (select === 'Save') {
			$.ajax('/weight?save', {
				type : 'POST',
				data : {
					time : time,
					weight : weight
				}
			}).done(function(data, textStatus, jqXHR) {
				console.log(data);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
			});
		} else if (select === 'Remove') {
			$.ajax('/weight?remove', {
				type : 'POST',
				data : {
					id : id
				}
			}).done(function(data, textStatus, jqXHR) {
				console.log(data);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
			});
		} else if (select === 'Update') {
			$.ajax('/weight?update', {
				type : 'POST',
				data : {
					id : id,
					time : time,
					weight : weight
				}
			}).done(function(data, textStatus, jqXHR) {
				console.log(data);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
			});
		}
	});
});

$.ajax('/weight?latest', {
	type : 'GET',
	data : ''
}).done(function(data, textStatus, jqXHR) {
	console.log(data);
}).fail(function(jqXHR, textStatus, errorThrown) {
	console.log(textStatus);
	console.log(errorThrown);
});

$.ajax('/weight?pages', {
	type : 'GET',
	data : ''
}).done(function(data, textStatus, jqXHR) {
	console.log(data);
}).fail(function(jqXHR, textStatus, errorThrown) {
	console.log(textStatus);
	console.log(errorThrown);
});

$.ajax('/weight?query&page=1', {
	type : 'GET',
	data : ''
}).done(function(data, textStatus, jqXHR) {
	console.log(data);
}).fail(function(jqXHR, textStatus, errorThrown) {
	console.log(textStatus);
	console.log(errorThrown);
});
