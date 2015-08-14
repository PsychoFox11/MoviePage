'use strict';

var express = require('express'),
crud = require('./serverModules/crud'),
router = express.Router(),
base = 'public',
// Mongo stuff
crud = require('./serverModules/crud'),
url = 'mongodb://localhost/mainDB',
ObjectID = require('mongodb').ObjectID,
// End Mongo stuff
loggedIn, formSettings, dataTypes;

loggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

function fixQuery(query, method) { // Corrects datatypes since formData object sends everything as strings
    var isNumbers = true,
    allNulls = true,
    currentType, currentValue, value, tempArray;

    if (method === 'formSettings') {
        if (query.hasOwnProperty('order')) {
            query.order = isNaN(parseInt(query.order)) ? null : parseInt(query.order);
        }
        if (query.type === 'checkbox' || query.type === 'dropdown' || query.type === 'year' || query.type === 'number') {
            tempArray = query.values.split(',');
            for (var m = 0; m < tempArray.length; m++) {
                tempArray[m] = tempArray[m].trim();
                console.log('tempArray');
                console.log(typeof tempArray[m]);
                if (tempArray[m] !== '') {
                    allNulls = false;
                }
            }
            if (allNulls) {
                tempArray = [];
            }
            query.values = tempArray;
        }

        if (query.type === 'number' || query.type === 'year') {
            if (query.values instanceof Array) {
                for (var k = 0; k < query.values.length; k++) {
                    if (query.dataType === 'float') {
                        query.values[k] = isNaN(parseFloat(query.values[k])) ? null : parseFloat(query.values[k]);
                    } else if (query.dataType === 'int') {
                        query.values[k] = isNaN(parseInt(query.values[k])) ? null : parseInt(query.values[k]);
                    }
                }
            } else {
                if (query.dataType === 'float') {
                    query.values = isNaN(parseFloat(query.values)) ? null : parseFloat(query.values);
                } else if (query.dataType === 'int') {
                    query.values = isNaN(parseInt(query.values)) ? null : parseInt(query.values);
                }
            }
        }
    }


    if (method === 'upload') { // If from a TSV upload, separate into individual items then run fixQuery on each
        if (query instanceof Array) {
            for (var i = 0; i < query.length; i++) {
                fixQuery(query[i], 'uploadItem');
            }
        }
        return;
    }


    for (var key in query) {
        currentType = dataTypes[key];
        currentValue = query[key];

        if (key === '_id') {
            console.log('idstuff');
            currentValue = new ObjectID(currentValue);
        }

        switch (method) {
            case 'search': { // Format array query properly with $in, set string search to use RegExp
                console.log('key: ' + currentValue + ' type: ' + typeof currentValue);
                if (currentValue instanceof Array) {
                    currentValue = {$in: currentValue};
                } else if (currentType === 'string') {
                    currentValue = new RegExp(currentValue, 'i');
                }
                break;
            }

            case 'uploadItem': { // Convert comma seperated values into an array where applicible, trim spaces
                if (currentType === 'array') {
                    if (currentValue.indexOf(',') !== -1) {
                        currentValue = currentValue.split(',');
                        for (var j = 0; j < currentValue.length; j++) {
                            currentValue[j] = currentValue[j].trim();
                        }

                        if (currentValue instanceof Array && currentValue.length === 1) {
                            currentValue = currentValue[0].trim();
                        }
                    }
                }
            }
        }

        switch (currentType) {
            case 'int': {
                value = parseInt(currentValue);
                currentValue = isNaN(value) ? null : value;
                break;
            }

            case 'float': {
                value = parseFloat(currentValue);
                currentValue = isNaN(value) ? null : value;
                break;
            }
        }

        query[key] = currentValue;
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


// Connect to DB and get form settings
crud.connect(url, function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        setFormSettings();
    }
});

module.exports = function (passport) {

    router.post('/login', passport.authenticate('login'), function (req, res) {
        console.log('Login successful for ' + req.user.firstName);
        res.send(req.user);
    });

    router.post('/signup', passport.authenticate('signup'), function (req, res) {
        console.log('Signup successful for ' + req.user.firstName);
        res.send(req.user);
    });

    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get('/angular', loggedIn, function (req, res) {
        var options = {
            root: __dirname + '/' + base + '/'
        };
        res.sendFile('angular.html', options, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            } else {
                console.log('Request URL: ' + req.originalUrl);
            }
        });
    });

    // Fetch form maker settings
    router.post('/settings', loggedIn, function (req, res) {
        console.log('blah');
        if (formSettings) {
            res.send(JSON.stringify(formSettings));
        } else {
            console.log('no form settings object');
        }
    });

    // Add item to DB
    router.post('/create', loggedIn, function (req, res) {
        // JSCS console.log('CREATE: ' + JSON.stringify(req.body));
        var query = req.body;

        console.log('origQuery');
        console.log(query);

        fixQuery(query, 'create');

        console.log('query');
        console.log(query);

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

    // Update item in DB
    router.post('/update', loggedIn, function (req, res) {
        // JSCS console.log('CREATE: ' + JSON.stringify(req.body));
        var query = req.body,
        id, newQuery;

        fixQuery(query, 'update');

        id = { _id: query._id };
        delete query._id;
        console.log('query id: ' + id);

        newQuery = {
            $set: query
        };

        console.log('newQuery');
        console.log(JSON.stringify(newQuery));
        crud.update(id, newQuery, 'test', function (err, result) {
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

    // Delete item from DB
    router.post('/delete', loggedIn, function (req, res) {
        // JSCS console.log('CREATE: ' + JSON.stringify(req.body));
        var query = req.body;

        fixQuery(query, 'delete');
        console.log('deleting');

        crud.delete(query, 'test', function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                // Removing _id since Mongo adds it to req.body, but we don't need it on the client side
                res.send(JSON.stringify(req.body));
            }

        });

    });


    // Search
    router.post('/search', loggedIn, function (req, res) {
        var searchColl = 'test', // DB collection to search
        query = req.body;

        fixQuery(query, 'search');

        console.log('query: ' + JSON.stringify(query));

        crud.read(query, {}, searchColl, function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                console.log('docs');
                // JSCS console.log(JSON.stringify(docs));
                res.send(JSON.stringify(docs));
            }
        });
    });

    router.post('/upload', loggedIn, function (req, res) {
        var query = JSON.parse(req.body.jsonDb);

        fixQuery(query, 'upload');

        console.log('query');
        console.log(query);

        crud.create(query, 'test', function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(JSON.stringify(req.body));
            }

        });

    });

    router.post('/updateAdvancedCutoff', loggedIn, function (req, res) {
        var query = req.body,
        cutoff = parseInt(query.cutoff),
        changeSelect = {},
        changeDocs = {};

        changeSelect.advanced = {$exists: true};

        changeDocs.$unset = {};
        changeDocs.$unset.advanced = 1;

        crud.updateMulti(changeSelect, changeDocs, 'formSettings', function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log('Removed advanced property');
                changeSelect = {};
                changeDocs = {};

                changeSelect.order = {};
                changeSelect.order.$gte = cutoff;

                changeDocs.$set = {};
                changeDocs.$set.advanced = true;

                crud.updateMulti(changeSelect, changeDocs, 'formSettings', function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        setFormSettings();
                        console.log('Set new advanced properties');
                    }
                    res.send(JSON.stringify(req.body));
                });
            }
        });
    });

    router.post('/updateFormSettings', loggedIn, function (req, res) {
        var query = req.body,
        oldName = query.oldName,
        newQuery = {},
        finalQuery = {},
        changeSelect = {},
        changeDocs = {},
        updateType = query.updateType;
        console.log('updateType');
        console.log(query.updateType);
        delete query.oldName;

        console.log('query');
        console.log(JSON.stringify(query));

        fixQuery(query, 'formSettings');

        console.log('fixed');
        console.log(JSON.stringify(query));

        if (query.updateType === 'destroy') {
            delete query.updateType;
            console.log('destroying');
        }
        if (query.updateType === 'name' || query.updateType === 'nameOrder') {
            console.log('name changed');
            newQuery.name = query.name;
        }
        if (query.updateType === 'order' || query.updateType === 'nameOrder') {
            console.log('order changed');
            newQuery.order = query.order;
        }
        newQuery.type = query.type;

        if (query.hasOwnProperty(updateType)) {
            console.log('update type true');
            delete query.updateType;
            finalQuery = {$set: newQuery};
        } else {
            finalQuery = query;
        }

        // Make update queries
        changeSelect[oldName] = {$exists: true};

        console.log('update type');
        console.log(updateType);

        if (updateType === 'destroy') { // Remove the property from anything that has it.
            changeDocs.$unset = {};
            changeDocs.$unset[oldName] = 1;
        }
        if (updateType === 'name' || updateType === 'nameOrder') {
            changeDocs.$rename = {};
            changeDocs.$rename[oldName] = query.name;
        }
        if (updateType === 'order' || updateType === 'nameOrder') {
            changeDocs.$set = {};
            changeDocs.$set = {order: query.order};
        }

        console.log('changeSelect');
        console.log(JSON.stringify(changeSelect));

        console.log('changeDocs');
        console.log(JSON.stringify(changeDocs));


        console.log('final');
        console.log(JSON.stringify(finalQuery));

        crud.update({name: oldName}, finalQuery, 'formSettings', function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                setFormSettings();
                crud.updateMulti(changeSelect, changeDocs, 'test', function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        console.log('Changed Form Setting stuff');
                    }
                });
                res.send(JSON.stringify(req.body));
            }
        });
    });

    return router;
};