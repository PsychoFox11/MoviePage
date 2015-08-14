'use strict';

var express = require('express'),
multer = require('multer'),
fs = require('fs'), // Require file system
app = express(),
base = 'public',
port = 3000,
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
passport = require('passport'),
expressSession = require('express-session'),
routes = require('./routes')(passport),
initPassport = require('./passport-init'),
sessionSecret = 'mySecretKey',
server;

app.set('port', (process.env.PORT || port));

// Multer parses multi part form data, then we set upload dir
app.use(multer({dest: './uploads/'}));

// Configure POST processing.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Configure session.
app.use(cookieParser());

// Configure Passport.
initPassport(passport);
app.use(expressSession({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

// Set base dir of static files
app.use(express.static(base));

// Temporary - echos string
app.get('/test', function (req, res) {
    res.send(req.query);
});

app.use(function (req, res, next) {
    var err = new Error('Not Found: ' + req.path);
    err.status = 404;
    next(err);
});

// Start the server
server = app.listen(app.get('port'), function () {

    var host = server.address().address,
    port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});

