var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
// Local includes
var config = require('./config');
var pass = require('./lib/pass');
var user = require('./routes/user');
var exerciseApi = require('./routes/exerciseapi');
var weightApi = require('./routes/weightapi');
var workoutApi = require('./routes/workoutapi');
var workoutDataApi = require('./routes/workoutdataapi');
var historyApi = require('./routes/historyapi');

// Make sure nothing is missing in the config file
if (!config.SERVER_ADDRESS) {
  throw new Error('config.SERVER_ADDRESS is missing');
}
if (!config.SESSION_SECRET) {
  throw new Error('config.SESSION_SECRET is missing');
}
if (!config.EMAIL_ACCOUNT) {
  throw new Error('config.EMAIL_ACCOUNT is missing');
}
if (!config.EMAIL_PASSWORD) {
  throw new Error('config.EMAIL_PASSWORD is missing');
}

var app = express();

app.set('port', process.env.VCAP_APP_PORT || 80);
app.use(express.compress());
app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({
  secret : config.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(function(req, res, next) {
  // Force ssl, x-forwarded-proto is set by appfog
  var host = req.get('host');
  if (req.get('x-forwarded-proto') === 'https' || req.secure === true || host === 'localhost') {
    return next();
  }
  res.redirect('https://' + host + req.url);
});
// var staticPath = path.join(__dirname, '..', 'strength_history_web');
var staticPath = path.join(__dirname, 'public');
var indexPath = path.join(staticPath, 'index.html');
app.use(express.static(staticPath));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Set up paths needed to use pushState in Backbone.js
app.get('/:var(exercises*|workouts*|run/*|history|history/edit/*|signup)', function(req, res) {
  res.sendfile(indexPath);
});

// User routes
app.get('/js/userdata.js', user.getUserData);
app.get('/logout', user.logout);
app.get('/activate', user.activate);
app.post('/login', user.postLogin);
app.post('/signup', user.postSignUp);

// Exercise API
app.del('/exercise/:id', pass.ensureAuthenticated, exerciseApi.del);
app.get('/exercise/latest/:id', pass.ensureAuthenticated, exerciseApi.getLatest);
app.get('/exercise', pass.ensureAuthenticated, exerciseApi.get);
app.get('/exercise/:id', pass.ensureAuthenticated, exerciseApi.getId);
app.post('/exercise', pass.ensureAuthenticated, exerciseApi.post);
app.put('/exercise/:id', pass.ensureAuthenticated, exerciseApi.put);

// Weight API
app.del('/weight/:id', pass.ensureAuthenticated, weightApi.del);
app.get('/weight/latest', pass.ensureAuthenticated, weightApi.getLatest);
app.get('/weight', pass.ensureAuthenticated, weightApi.get);
app.get('/weight/:id', pass.ensureAuthenticated, weightApi.getId);
app.post('/weight', pass.ensureAuthenticated, weightApi.post);
app.put('/weight/:id', pass.ensureAuthenticated, weightApi.put);

// Workout API
app.del('/workout/:id', pass.ensureAuthenticated, workoutApi.del);
app.get('/workout/latest/:id', pass.ensureAuthenticated, workoutApi.getLatest);
app.get('/workout', pass.ensureAuthenticated, workoutApi.get);
app.get('/workout/:id', pass.ensureAuthenticated, workoutApi.getId);
app.post('/workout', pass.ensureAuthenticated, workoutApi.post);
app.put('/workout/:id', pass.ensureAuthenticated, workoutApi.put);

// Workout data API
app.del('/workoutdata/:id', pass.ensureAuthenticated, workoutDataApi.del);
app.get('/workoutdata', pass.ensureAuthenticated, workoutDataApi.get);
app.get('/workoutdata/:id', pass.ensureAuthenticated, workoutDataApi.getId);
app.post('/workoutdata', pass.ensureAuthenticated, workoutDataApi.post);
app.put('/workoutdata/:id', pass.ensureAuthenticated, workoutDataApi.put);

// History API
app.get('/historydata', pass.ensureAuthenticated, historyApi.get);
app.get('/historydata/pages/:id', pass.ensureAuthenticated, historyApi.getPage);
app.get('/historydata/pages', pass.ensureAuthenticated, historyApi.getPages);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Strength History Web listening on port ' + app.get('port'));
});
