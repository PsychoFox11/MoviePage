'use strict';

var LocalStrategy = require('passport-local').Strategy,
bCrypt = require('bcrypt-nodejs'),
// Mongo stuff
MongoClient = require('mongodb').MongoClient,
url = require('./dbConfig').url,
userCollection = 'user',
ObjectID = require('mongodb').ObjectID,
// End Mongo stuff
createHash, validPassword, dbUser;

createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

validPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
};

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        console.log(JSON.stringify(user));
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        MongoClient.connect(url, function (err, db) {
            var collection;

            if (err) {
                console.log(err);
                return done(err);
            }

            collection = db.collection(userCollection);
            collection.findOne({_id: new ObjectID(id)}, function (err, user) {
                db.close();
                console.log(err);
                return done(err, user);
            });
        });
    });

    passport.use('signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: true
    }, function (req, username, password, done) {
        var signUpUser = function () {
            MongoClient.connect(url, function (err, db) {
                var collection;

                if (err) {
                    return done(err);
                }

                collection = db.collection(userCollection);
                collection.findOne({username: username}, function (err, user) {
                    if (err) {
                        db.close();
                        return done(err);
                    }
                    if (user) {
                        db.close();
                        console.log(username + ' already exists!');
                        return done(null, false, username + 'already exists!');
                    } else {
                        dbUser = {};

                        dbUser.username = username;
                        dbUser.password = createHash(password);
                        dbUser.email = req.body.email;
                        dbUser.firstName = req.body.firstName;
                        dbUser.lastName = req.body.lastName;

                        console.log(JSON.stringify(req.body));
                        collection.insert(dbUser, function (err, result) {
                            db.close();
                            return done(err, dbUser);
                        });
                    }
                });
            });
        };
        process.nextTick(signUpUser);
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: true
    }, function (req, username, password, done) {

        MongoClient.connect(url, function (err, db) {
            var collection;

            if (err) {
                return done(err);
            }

            collection = db.collection(userCollection);
            collection.findOne({username: username}, function (err, user) {
                db.close();
                if (err) {
                    return done(err);
                }

                if (!user) {
                    console.log('User Not Found with username ' + username);
                    return done(null, false, 'User not found.');
                }

                if (!validPassword(user, password)) {
                    console.log('Invalid Password');
                    return done(null, false, 'Invalid Password');
                }
                console.log('User for passport: ' + JSON.stringify(user));
                return done(null, user);
            });
        });
    }));
};