/* global EJS*/
'use strict';

var renderForm = require('./formMaker.js'),
getFormSettingsThen = require('./getFormSettings.js');

function setEditValues (formSettings, results, $ejsForm) {
    var result = JSON.parse(results)[0],
    currentValue, currentName;

    for (var i = 0; i < formSettings.length; i++) {
        currentName = formSettings[i].name;
        currentValue = result[currentName];

        if (formSettings[i].type !== 'checkbox') {
            $ejsForm.find('[name=\'' + currentName + '\']').val(currentValue);
        } else {
            if (currentValue instanceof Array) {
                for (var j = 0; j < currentValue.length; j++) {
                    $ejsForm.find('[name=\'' + currentName + '\']' + '[value=\'' + currentValue[j] + '\']').attr('checked', true);
                    // $ejsForm.find('[name=Format][value=Blu-ray]').attr('checked', true);
                }
            } else {
                $ejsForm.find('[name=\'' + currentName + '\']' + '[value=\'' + currentValue + '\']').attr('checked', true);
            }
        }
    }
}

function editItem(event) {
    event.preventDefault();

    var data = new FormData(),
    url = '/search',
    method = 'POST',
    itemId = $(this).attr('data-id'),
    $ejsForm = $(new EJS({url: 'views/editItem.ejs'}).render({itemId: itemId}));

    data.append('_id', itemId);
    console.log('button data id');
    console.log($(this).attr('data-id'));

    $.ajax({
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: method,
        success: function (data) {

            getFormSettingsThen(function (formSettings) {
                console.log('here23');
                $ejsForm.find('#inputs').html(renderForm(formSettings));

                setEditValues(formSettings, data, $ejsForm);
                console.log('edited values');
                $.colorbox({
                    open: true, // Open the lightbox immediately.
                    href: $ejsForm, // Show this html.
                    inline: true, // Use html.
                    innerWidth: 640,
                    innerHeight: 390, // Set size of frame.
                    opacity: 0
                });
                $('#editForm').submit(updateItem);
            });
        }
    });
}

function goBack(event) { // Also in singleItemPage.js - combine

    $('#singleItemDiv').remove();
    $('#searchDiv').removeClass('hidden');
}

function openUpdatedItemPage(itemId) {

    var data = new FormData(),
    url = '/search',
    method = 'POST',
    $body = $('#mainBodyDiv'),
    ejsResult, searchResults;

    data.append('_id', itemId);

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
                ejsResult = new EJS({url: 'views/singleItem.ejs'}).render({formSettings: formSettings, singleItem: singleItem, updated: true});
                $('#singleItemDiv').remove();
                $body.append(ejsResult);
                $('#updatedSearch').removeClass('hidden');
                $('#singleItemBack').click(goBack);
                $('#editButton').click(editItem);
            });
        }
    });
}


function updateItem(event) {
    event.preventDefault();

    var data = new FormData(this),
    url = this.action,
    method = 'POST',
    itemId = $(this).attr('data-id');

    console.log('Updating Item');

    data.append('_id', itemId);

    console.log(document.getElementsByName('Format').length);
    console.log(this.Title.value);

    $.ajax({
        url: url,
        data: data,
        contentType: false,
        processData: false,
        method: method,
        success: function (data) {
            openUpdatedItemPage(itemId);
            $.colorbox.close();
            console.log('updated');
        }
    });
}

module.exports = editItem;