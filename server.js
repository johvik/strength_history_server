var express = require('express');
var app = express();

app.use(express.compress());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	// res.set('Cache-Control', 'public, max-age=1800');
	res.render(__dirname + '/index.jade', {
		title : 'Strength History'
	});
});

app.listen(process.env.VCAP_APP_PORT || 80);
