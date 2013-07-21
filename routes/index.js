exports.index = function(req, res) {
	res.render('index', {
		title : 'Strength History',
		user : req.user,
		message : req.session.message
	});
	delete req.session.message; // only display it once
};
