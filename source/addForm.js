'use strict';

var renderForm = require('./formMaker.js');

function openAddForm() {
    getSettings(); // From formMaker.js
    $('#addForm').submit(addItem);
}

function addItem(event) {
    event.preventDefault();

    var data = new FormData(this),
    url = this.action,
    method = 'POST';
    console.log('Adding Item');

    $.ajax({
        url: this.action,
        data: data,
        contentType: false,
        processData: false,
        method: 'POST',
        success: function (data) {
            $('#outputDiv').html(data);
        }
    });
}

function getSettings() {
    var url = '/settings',
    method = 'POST',
    data = new FormData();

    data.append('settings', 'formSettings'); // Which settings to get

    console.log('getting form objects');

    $.ajax({
        url: url,
        data: data,
        method: method,
        contentType: false,
        processData: false,
        success: function (data) {
            data = JSON.parse(data);
            renderForm(data);
        }
    });
}


module.exports = openAddForm;