'use strict';

var Promise = require('promise');

function getFormSettingsThen(callback) {
    return new Promise(function (resolve, reject) {
        var url = '/settings',
        method = 'POST',
        data = new FormData();

        data.append('settings', 'formSettings'); // Which collection and settings to get (probably need to take this out eventually)

        console.log('getting form objects');

        $.ajax({
            url: url,
            data: data,
            method: method,
            contentType: false,
            processData: false,
            success: function (data) {
                data = JSON.parse(data);
                sortSearchTypes(data);
                resolve(data); // Data contains form settings from DB
            },
            error: function () {
                reject('Ajax error fetching form settings');
            }
        });
    })
    .then(callback, function (err) {
        console.log(err);
    });
}

function sortSearchTypes(searchTypes) { // Move this somewhere, appears in addform.ejs, formaker.js, search.js
    console.log('sorting');
    searchTypes.sort(function (a, b) {
        if (typeof a.order !== 'number') {
            return -1;
        } else if (typeof b.order !== 'number') {
            return 0;
        } else {
            return a.order - b.order;
        }
    });
}


module.exports = getFormSettingsThen;