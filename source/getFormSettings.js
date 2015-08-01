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
                resolve(JSON.parse(data)); // Data contains form settings from DB
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

module.exports = getFormSettingsThen;