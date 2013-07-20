var express = require('express');
var app = express();

app.use(express.bodyParser());
app.use(express.compress());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	// res.set('Cache-Control', 'public, max-age=1800');
	res.render(__dirname + '/index.jade', {
		title : 'Strength History'
	});
});

app.post('/test', function(req, res) {
	if (req.body.user == 'test' && req.body.password == 'test') {
		var data = {
			test : "test1",
			tt : 2.5,
			array : [ 2, 43, 4, 3 ]
		};
		res.json(data);
	} else {
		res.send(401);
	}
});

app.listen(process.env.VCAP_APP_PORT || 80);
