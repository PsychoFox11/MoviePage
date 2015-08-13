'use strict';

var MongoClient = require('mongodb').MongoClient,
db, crud;

crud = {

    connect: function (url, callback) {
        MongoClient.connect(url, {auto_reconnect: true}, function (err, database) {
            if (err) {
                callback(err);
            } else {
                db = database;
                callback(err, {connected: true});
            }
        });
    },

    close: function () {
        if (db) {
            db.close();
        }
    },

    create: function (query, collectionName, callback) {
        var collection;
        if (db) {
            collection = db.collection(collectionName);
            // The {w: 1} tells it to wait for the first part to be done.
            collection.insert(query, {w: 1}, callback);
        } else {
            callback(new Error('DB not connected'));
        }
    },

    read: function (query, params, collectionName, callback) {
        var collection;
        if (db) {
            collection = db.collection(collectionName);
            // The {w: 1} tells it to wait for the first part to be done.
            collection.find(query, params).toArray(callback);
        } else {
            callback(new Error('DB not connected'));
        }
    },

    update: function (current, update, collectionName, callback) {
        var collection;
        if (db) {
            collection = db.collection(collectionName);
            // The {w: 1} tells it to wait for the first part to be done.
            collection.update(current, update, {w: 1}, function (err, result) {
                callback(err, result);
            });
        } else {
            callback(new Error('DB not connected'));
        }
    },

    delete: function (query, collectionName, callback) {
        var collection;
        if (db) {
            collection = db.collection(collectionName);
            collection.remove(query, {w: 1}, function (err, result) {
                callback(err, result.result);
            });
        } else {
            callback(new Error('DB not connected'));
        }
    }
};

module.exports = crud;