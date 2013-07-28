var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var pass = require('./lib/pass');
var routes = require('./routes');
var api = require('./routes/api');
var user = require('./routes/user');
var weightApi = require('./routes/weightapi');

var app = express();

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

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.del('/weight/:id', pass.ensureAuthenticated, weightApi.del);
app.get('/weight/latest', pass.ensureAuthenticated, weightApi.getLatest);
app.get('/weight/pages/:id', pass.ensureAuthenticated, weightApi.getPage);
app.get('/weight/pages', pass.ensureAuthenticated, weightApi.getPages);
app.post('/weight', pass.ensureAuthenticated, weightApi.post);
app.put('/weight/:id', pass.ensureAuthenticated, weightApi.put);

app.get('/', routes.index);
app.get('/logout', user.logout);
app.get('/test', pass.ensureAuthenticated, api.test);

app.post('/login', user.login);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Strength History Web listening on port ' + app.get('port'));
});
