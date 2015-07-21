'use strict';

var testRender = require('./formMaker.js');

function openAddForm() {
    testRender(); // From formMaker.js
    $('#addForm').submit(addItem);
}

function addItem(event) {
    event.preventDefault();

    var data = new FormData(this),
    xhr = new XMLHttpRequest(),
    url = this.action,
    method = 'POST';
    console.log('Adding Item');
    for (var key in data) {
        console.log('Formdata ' + key + ': ' + data[key]);
    }
    console.log(this.action);

    $.ajax({
        url: this.action,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        success: function (data) {
            $('#outputDiv').html(data);
        }
    });
}

module.exports = openAddForm;