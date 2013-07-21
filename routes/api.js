exports.test = function(req, res) {
	res.send('Hello ' + req.user.username + '!');
};
