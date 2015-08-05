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
                console.log('results');
                console.log(data);
                searchResults = JSON.parse(data);
                ejsResult = new EJS({url: 'views/searchResults.ejs'}).render({formSettings: formSettings, searchResults: searchResults});
                $output.empty();
                $output.append(ejsResult);
                addCheckboxListeners();
                addSingleItemListeners();
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

function addSingleItemListeners() {
    $('.itemLink').click(openItemPage);
}

function openItemPage(event) {
    event.preventDefault();

    var data = new FormData(),
    url = '/search',
    method = 'POST',
    $body = $('#mainBodyDiv'),
    ejsResult, searchResults;

    console.log('blah');
    console.log($(this).attr('data-id'));
    data.append('_id', $(this).attr('data-id'));

    $.ajax({
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        success: function (data) {
            getFormSettingsThen(function (formSettings) {
                var singleItem = JSON.parse(data);
                console.log('data');
                console.log(data);

                ejsResult = new EJS({url: 'views/singleItem.ejs'}).render({formSettings: formSettings, singleItem: singleItem});
                $('#searchDiv').addClass('hidden');
                $body.append(ejsResult);
            });
        }
    });
}

module.exports = renderSearchForm;



