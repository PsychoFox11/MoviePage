/* global EJS*/
'use strict';

var getFormSettingsThen = require('./getFormSettings.js'),
renderForm = require('./formMaker.js'),
editItem = require('./updateItem.js');

function goBack(event) {

    console.log('button');
    $('#singleItemDiv').remove();
    $('#searchDiv').removeClass('hidden');
}

function openItemPage(event) {
    event.preventDefault();

    var data = new FormData(),
    url = '/search',
    method = 'POST',
    $body = $('#mainBodyDiv'),
    ejsResult, searchResults;

    data.append('_id', $(this).attr('data-id'));

    $.ajax({
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: method,
        success: function (data) {
            getFormSettingsThen(function (formSettings) {
                var singleItem = JSON.parse(data);

                ejsResult = new EJS({url: 'views/singleItem.ejs'}).render({formSettings: formSettings, singleItem: singleItem, updated: false});
                $('#searchDiv').addClass('hidden');
                $body.append(ejsResult);
                $('#singleItemBack').click(goBack);
                $('#editButton').click(editItem);
            });
        }
    });
}

module.exports = openItemPage;