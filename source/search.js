/* global EJS*/
'use strict';

var getFormSettingsThen = require('./getFormSettings.js'),
renderForm = require('./formMaker.js');

function renderSearchForm() {
    var $body = $('#mainBodyDiv'),
    $ejsForm = $(new EJS({url: 'views/search.ejs'}).render());

    getFormSettingsThen(function (result) { // Result is parsed formSettings, returns Promise
        var data = result;
        // JSCS data = JSON.parse(data); // Data contains form settings from DB
        $ejsForm.find('#inputs').html(renderForm(data, 'simple'));
        $ejsForm.find('#advInputs').html(renderForm(data, 'advanced'));
        $body.empty();
        $body.append($ejsForm);
        $('#searchForm').submit(submitForm);
        $('.advancedLink').click(changeMode);
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
    $output = $('#outputDiv'),
    ejsResult, searchResults;

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
            getFormSettingsThen(function (formSettings) {
                searchResults = JSON.parse(data);
                ejsResult = new EJS({url: 'views/searchResults.ejs'}).render({formSettings: formSettings, searchResults: searchResults});
                $output.empty();
                $output.append(ejsResult);
                addCheckboxListeners();
            });
        }
    });
}

// Find all with gridCheckBox class and add a listener to it. Checkboxes get names in EJS from formsettings so it will match.
function addCheckboxListeners() {
    $('.gridCheckbox').change(function (event) {
        if (!this.checked) {
            $('[data-type=\'' + this.value + '\']').addClass('hidden');
        } else {
            $('[data-type=\'' + this.value + '\']').removeClass('hidden');
        }
    });
}

module.exports = renderSearchForm;



