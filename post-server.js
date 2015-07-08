var express = require('express'),
multer = require('multer'),
fs = require('fs'), //require file system
app = express(),
base = 'public',
port = 3000,
server;

//set base dir of static files
app.use(express.static(base));

//parse multipart/form-data
app.use(multer({dest: './uploads/'}));

app.post('/upload', function (req, res) {
	console.log(req.body);
	console.log(req.files);
	res.send('<p>' + JSON.stringify(req.files) + '</p>');
	//delete uploaded files after processing.
	for (var file in req.files) {
//		fs.unlink.req.files[file].path); //unlink deletes
	}
});

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