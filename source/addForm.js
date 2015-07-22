'use strict';

var renderForm = require('./formMaker.js');

function openAddForm() {
    getSettings(); // From formMaker.js
    $('#addForm').submit(addItem);
}

function addItem(event) {
    event.preventDefault();

    var data = new FormData(this),
    // JSCS xhr = new XMLHttpRequest(),
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
    formSettings = 'formSettings'; // Which settings to get
    console.log('getting form objects');

    $.ajax({
        url: url,
        data: formSettings,
        method: method,
        success: function (data) {
            data = JSON.parse(data);
            renderForm(data);
        }
    });
}


module.exports = openAddForm;