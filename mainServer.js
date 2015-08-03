'use strict';

var express = require('express'),
multer = require('multer'),
fs = require('fs'), // Require file system
app = express(),
base = 'public',
port = 3000,
// Mongo stuff
crud = require('./serverModules/crud'),
url = 'mongodb://localhost:27017/mainDB',
// End Mongo stuff
server, formSettings, dataTypes;

function callback(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
}

// Store formSettings and create dataTypes object based on it
function setFormSettings() {
    crud.read({}, {_id: 0}, 'formSettings', function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            formSettings = docs;
            dataTypes = {};
            for (var key in formSettings) {
                dataTypes[formSettings[key].name] = formSettings[key].dataType;
            }
            console.log('datatypes');
            console.log(JSON.stringify(dataTypes));
        }
    });
}

function fixQuery(query) { // Corrects datatypes since formData object sends everything as strings
    var currentType, value;

    for (var key in query) {
        currentType = dataTypes[key];

        switch (currentType) {
            case 'int': {
                value = parseInt(query[key]);
                query[key] = isNaN(value) ? null : value;
                break;
            }

            case 'float': {
                value = parseFloat(query[key]);
                query[key] = isNaN(value) ? null : value;
                break;
            }
        }
    }
}

// Connect to DB and get form settings
crud.connect(url, function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        setFormSettings();
    }
});

// Set base dir of static files
app.use(express.static(base));

// Multer parses multiform data, then we set upload dir
app.use(multer({dest: './uploads/'}));

// Temporary - echos string
app.post('/post', function (req, res) {
    var returnString = '';
    for (var key in req.body) {
        returnString += key + ' : ' + req.body[key] + '<br>';
    }
    res.send(returnString);
});

// Add item to DB
app.post('/create', function (req, res) {
    // JSCS console.log('CREATE: ' + JSON.stringify(req.body));
    var query = req.body,
    returnResult;

    fixQuery(query);

    crud.create(query, 'test', function (err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            // Removing _id since Mongo adds it to req.body, but we don't need it on the client side
            delete req.body._id;
            res.send(JSON.stringify(req.body));
        }

    });

});

// Fetch form maker settings
app.post('/settings', function (req, res) {
    if (formSettings) {
        res.send(JSON.stringify(formSettings));
    } else {
        console.log('no form settings object');
    }
});

// Search
app.post('/search', function (req, res) {
    var searchColl = 'test', // DB collection to search
    query = req.body;

    fixQuery(query);

    for (var key in query) {
        console.log('key: ' + query[key] + ' type: ' + typeof query[key]);
        if (query[key] instanceof Array) {
            query[key] = {$in: query[key]};
        } else if (dataTypes[key] === 'string') {
            query[key] = new RegExp('^' + query[key] + '$', 'i');
        }
    }

    console.log('query: ' + JSON.stringify(query));

    crud.read(query, {_id: 0}, searchColl, function (err, docs) {
        if (err) {
            res.send(err);
        } else {
            // JSCS res.send('blahhhhh');
            res.send(JSON.stringify(docs));
        }
    });
});

// Start the server
server = app.listen(port, function () {

    var host = server.address().address,
    port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});

