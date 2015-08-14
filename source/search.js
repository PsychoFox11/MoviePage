/* global EJS*/
'use strict';

var getFormSettingsThen = require('./getFormSettings.js'),
renderForm = require('./formMaker.js'),
openItemPage = require('./singleItemPage.js');

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
                console.log('searching');
                searchResults = JSON.parse(data);
                sortResults(formSettings, searchResults);
                ejsResult = new EJS({url: 'views/searchResults.ejs'}).render({formSettings: formSettings, searchResults: searchResults});
                $output.empty();
                $output.append(ejsResult);
                addCheckboxListeners();
                addSingleItemListeners();
            });
        }
    });
}

function sortResults(formSettings, results) { // Sort search results based on whichever key is order 0 in formSettings
    var mainKey;

    for (var key in formSettings) { // Determine which is the main key
        if (formSettings[key].order === 0) {
            mainKey = formSettings[key].name;
        }
    }

    results.sort(function (a, b) {
        if (a[mainKey] > b[mainKey]) {
            return 1;
        } else if (a[mainKey] < b[mainKey]) {
            return -1;
        } else {
            return 0;
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

function addSingleItemListeners() {
    $('.itemLink').click(openItemPage);
}

module.exports = renderSearchForm;



