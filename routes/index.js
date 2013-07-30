exports.index = function(req, res) {
	res.render('index', {
		title : 'Strength History',
		page : 'Home',
		user : req.user
	});
};
