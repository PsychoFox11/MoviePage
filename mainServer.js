var express = require('express'),
multer = require('multer'),
fs = require('fs'), //require file system
app = express(),
base = 'public',
port = 3000,
server;

//set base dir of static files
app.use(express.static(base));

// multer parses multiform data, then we set upload dir
app.use(multer({dest: './uploads/'}));

app.post('/upload', function (req, res) {
	for (var key in req.body) {
		console.log(req.body[key]);
	}
	//console.log(req.body);
	//res.json(JSON.parse(req.body['jsonDb']));
	res.send(req.body);
});

//parse multipart/form-data
//app.use(multer());

app.post('/post', function(req, res) {
	var returnString = '';
	console.log(req.body);
	for (var key in req.body) {
		returnString += key + ' : ' + req.body[key] + '<br>';
	}
	res.send(returnString);
});

//start the server
server = app.listen(port, function () {

	var host = server.address().address,
	port = server.address().port;

	console.log('Server listening at http://%s:%s', host, port);
});