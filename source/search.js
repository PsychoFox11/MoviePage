/* global EJS*/
'use strict';

var renderForm = require('./formMaker.js');

function renderSearchForm(event) {
    var url = '/settings',
    method = 'POST',
    data = new FormData(),
    $body = $('#mainBodyDiv'),
    $ejsForm = $(new EJS({url: 'views/search.ejs'}).render());

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
            $ejsForm.find('#inputs').html(renderForm(data, 'simple'));
            $ejsForm.find('#advInputs').html(renderForm(data, 'advanced'));
            $body.empty();
            $body.append($ejsForm);
            $('#searchForm').submit(submitForm);
            $('.advancedLink').click(changeMode);
        }
    });
}

function changeMode(event) {
    event.preventDefault();

    $('#advInputs').toggleClass('hidden');
    $('.advancedLink').toggleClass('hidden');

}

// Blah in progress
function submitForm(event) {
    event.preventDefault();

    var data = new FormData(this),
    xhr = new XMLHttpRequest(),
    url = this.action,
    method = 'POST';
    console.log('blah');
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

module.exports = renderSearchForm;