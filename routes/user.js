var passport = require('passport');

exports.login = function(req, res, next) {
	passport.authenticate('local', function(err1, user, info) {
		if (err1) {
			return next(err1);
		}
		if (!user) {
			req.session.message = info.message;
			return res.redirect('/');
		}
		req.logIn(user, function(err2) {
			if (err2) {
				return next(err2);
			}
			return res.redirect('/');
		});
	})(req, res, next);
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};
