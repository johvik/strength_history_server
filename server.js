var express = require('express');
var app = express();
var passport = require('passport');
var data = require('./data');
var pass = require('./pass');

app.configure(function() {
	app.use(express.compress());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.session({
		secret : 'secret'
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
	// res.set('Cache-Control', 'public, max-age=1800');
	res.render(__dirname + '/index.jade', {
		title : 'Strength History',
		user : req.user,
		message : req.session.message
	});
	delete req.session.message; // only display it once
});

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			req.session.message = info.message;
			return res.redirect('/');
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			return res.redirect('/');
		});
	})(req, res, next);
});

app.get('/test', pass.ensureAuthenticated, function(req, res) {
	res.send('hej!' + req.user.username);
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.listen(process.env.VCAP_APP_PORT || 80);
