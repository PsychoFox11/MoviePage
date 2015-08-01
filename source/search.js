/* global EJS*/
'use strict';

var getFormSettingsPromise = require('./getFormSettings.js'),
renderForm = require('./formMaker.js');

function renderSearchForm() {
    var prom = getFormSettingsPromise(),
    $body = $('#mainBodyDiv'),
    $ejsForm = $(new EJS({url: 'views/search.ejs'}).render());

    prom.then(function (result) { // Result is parsed formSettings
        var data = result;
        // JSCS data = JSON.parse(data); // Data contains form settings from DB
        $ejsForm.find('#inputs').html(renderForm(data, 'simple'));
        $ejsForm.find('#advInputs').html(renderForm(data, 'advanced'));
        $body.empty();
        $body.append($ejsForm);
        $('#searchForm').submit(submitForm);
        $('.advancedLink').click(changeMode);
    }, function (err) {
        console.log(err);
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
    method = 'POST',
    searchResults;

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
            // JSCS result = new EJS({url: 'views/searchResults.ejs'}).render({results: results});

            $('#outputDiv').html(data);
            console.log(data);
        }
    });
}

module.exports = renderSearchForm;



