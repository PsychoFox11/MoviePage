/* global EJS*/
'use strict';

var renderForm = require('./formMaker.js');

function openAddForm() {
    renderAddForm(); // From formMaker.js
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

function renderAddForm() { // EJS result passed from main.js
    var url = '/settings',
    method = 'POST',
    data = new FormData(),
    $body = $('#mainBodyDiv'),
    $ejsForm = $(new EJS({url: 'views/addForm.ejs'}).render());

    data.append('settings', 'formSettings'); // Which collection and settings to get

    console.log('getting form objects');

    $.ajax({
        url: url,
        data: data,
        method: method,
        contentType: false,
        processData: false,
        success: function (data) {
            data = JSON.parse(data); // Data contains form settings from DB
            $ejsForm.find('#inputs').html(renderForm(data));
            $body.empty();
            $body.append($ejsForm);
        }
    });
}


module.exports = openAddForm;