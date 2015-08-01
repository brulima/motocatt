var express = require('express');
var app     = express();
var fs      = require('fs');


app.get('/', function (req, res) {
	var home = fs.readFileSync('../index.html', 'utf-8');
	res.set('Content-Type', 'text/html');
	res.send(home.replace('<base href="http://brulima.github.io/motocatt/">', '<base href="http://homolog.com.br:8080/">'));
});

app.get('**.html', function (req, res) {
	var home = fs.readFileSync('../' + req.url, 'utf-8');
	res.set('Content-Type', 'text/html');
	res.send(home.replace('<base href="http://brulima.github.io/motocatt/">', '<base href="http://homolog.com.br:8080/">'));
});

app.use(express.static('../'));

var server = app.listen(8080, function() {
	var host = 'homolog.com.br';
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
});