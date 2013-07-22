var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userModel = require('./db/user').Model;

var failMessage = 'Failed to login';

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	userModel.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	userModel.findOne({
		username : username
	}, function(err1, user) {
		if (err1) {
			return done(err1);
		}
		if (!user) {
			return done(null, false, {
				message : failMessage
			});
		}
		user.comparePassword(password, function(err2, isMatch) {
			if (err2)
				return done(err2);
			if (isMatch) {
				return done(null, user);
			}
			return done(null, false, {
				message : failMessage
			});
		});
	});
}));

exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.send(401);
};
