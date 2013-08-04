var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var assetManager = require('connect-assetmanager');
// Local includes
var pass = require('./lib/pass');
var routes = require('./routes');
var api = require('./routes/api');
var user = require('./routes/user');
var exerciseApi = require('./routes/exerciseapi');
var weightApi = require('./routes/weightapi');
var workoutApi = require('./routes/workoutapi');
var workoutDataApi = require('./routes/workoutdataapi');

var app = express();

var assetManagerGroups = {
	'js' : {
		'debug' : true, // TODO Remove when done
		'route' : /^\/js\/$/,
		'path' : './public/js/',
		'dataType' : 'javascript',
		'files' : [ '*', 'routes/main.js', 'index.js' /* Main script last */]
	},
	'css' : {
		'route' : /^\/css\/$/,
		'path' : './public/css/',
		'dataType' : 'css',
		'files' : [ 'style.css' ]
	}
};
var assetsManagerMiddleware = assetManager(assetManagerGroups);

app.set('port', process.env.VCAP_APP_PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.compress());
app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({
	secret : 'secret'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(assetsManagerMiddleware);

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Main routes
app.get('/', routes.index);
app.get('/login', user.getLogin);
app.get('/logout', user.logout);
app.post('/login', user.postLogin);

app.get('/test', pass.ensureAuthenticated, api.test);

// Exercise API
app.del('/exercise/:id', pass.ensureAuthenticated, exerciseApi.del);
app.get('/exercise/latest/:id', pass.ensureAuthenticated, exerciseApi.getLatest);
app.get('/exercise/all', pass.ensureAuthenticated, exerciseApi.getAll);
app.get('/exercise', pass.ensureAuthenticated, exerciseApi.get);
app.get('/exercise/:id', pass.ensureAuthenticated, exerciseApi.getId);
app.post('/exercise', pass.ensureAuthenticated, exerciseApi.post);
app.put('/exercise/:id', pass.ensureAuthenticated, exerciseApi.put);

// Weight API
app.del('/weight/:id', pass.ensureAuthenticated, weightApi.del);
app.get('/weight/latest', pass.ensureAuthenticated, weightApi.getLatest);
app.get('/weight/pages/:id', pass.ensureAuthenticated, weightApi.getPage);
app.get('/weight/pages', pass.ensureAuthenticated, weightApi.getPages);
app.get('/weight', pass.ensureAuthenticated, weightApi.get);
app.get('/weight/:id', pass.ensureAuthenticated, weightApi.getId);
app.post('/weight', pass.ensureAuthenticated, weightApi.post);
app.put('/weight/:id', pass.ensureAuthenticated, weightApi.put);

// Workout API
app.del('/workout/:id', pass.ensureAuthenticated, workoutApi.del);
app.get('/workout/latest/:id', pass.ensureAuthenticated, workoutApi.getLatest);
app.get('/workout/all', pass.ensureAuthenticated, workoutApi.getAll);
app.get('/workout', pass.ensureAuthenticated, workoutApi.get);
app.get('/workout/:id', pass.ensureAuthenticated, workoutApi.getId);
app.post('/workout', pass.ensureAuthenticated, workoutApi.post);
app.put('/workout/:id', pass.ensureAuthenticated, workoutApi.put);

// Workout data API
app.del('/workoutdata/:id', pass.ensureAuthenticated, workoutDataApi.del);
app.get('/workoutdata/pages/:id', pass.ensureAuthenticated, workoutDataApi.getPage);
app.get('/workoutdata/pages', pass.ensureAuthenticated, workoutDataApi.getPages);
app.get('/workoutdata', pass.ensureAuthenticated, workoutDataApi.get);
app.get('/workoutdata/:id', pass.ensureAuthenticated, workoutDataApi.getId);
app.post('/workoutdata', pass.ensureAuthenticated, workoutDataApi.post);
app.put('/workoutdata/:id', pass.ensureAuthenticated, workoutDataApi.put);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Strength History Web listening on port ' + app.get('port'));
});
