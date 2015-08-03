/* global EJS*/
'use strict';

var renderForm = require('./formMaker.js'),
getFormSettingsThen = require('./getFormSettings.js');

function addItem(event) {
    event.preventDefault();

    var data = new FormData(this),
    url = this.action,
    method = 'POST';
    console.log('Adding Item');

    console.log(document.getElementsByName('Format').length);
    console.log(this.Title.value);

    $.ajax({
        url: this.action,
        data: data,
        contentType: false,
        processData: false,
        method: 'POST',
        success: function (data) {
            getFormSettingsThen(function (formSettings) { // Get formsettings then proceed
                var $outputDiv = $('#outputDiv'),
                addResult, $ejsResult, ejsRows;

                addResult = JSON.parse(data);
                ejsRows = new EJS({url: 'views/addResultsRow.ejs'}).render({formSettings: formSettings, addResult: addResult}); // Generate the rows

                if ($('#addResults').length === 0) {

                    $ejsResult = $(new EJS({url: 'views/addResults.ejs'}).render({formSettings: formSettings})); // Generate the table if it isn't there yet
                    $ejsResult.find('#addResultBody').append(ejsRows); // Add rows to table before displaying
                    $outputDiv.empty();
                    $outputDiv.append($ejsResult);
                } else {
                    $('#addResultBody').append(ejsRows); // If table is already there, just add rows
                }

            });
        }
    });
}

function renderAddForm() {
    var $body = $('#mainBodyDiv'),
    $ejsForm = $(new EJS({url: 'views/addForm.ejs'}).render()),
    data;

    getFormSettingsThen(function (result) {
        data = result; // Data contains form settings from DB
        $ejsForm.find('#inputs').html(renderForm(data));
        $body.empty();
        $body.append($ejsForm);
        $('#addForm').submit(addItem);
    });
}

module.exports = renderAddForm;