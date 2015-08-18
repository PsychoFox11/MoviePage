/* global EJS*/
'use strict';

var renderForm = require('./formMaker.js'),
getFormSettingsThen = require('./getFormSettings.js'),
deleteItem = require('./deleteItem.js');

function setEditValues (formSettings, results, $ejsForm) { // Populates the form with existing values
    var result = JSON.parse(results)[0],
    currentValue, currentName;

    for (var i = 0; i < formSettings.length; i++) {
        currentName = formSettings[i].name;
        currentValue = result[currentName];

        if (formSettings[i].type !== 'checkbox') {
            $ejsForm.find('[name=\'' + currentName + '\']').val(currentValue);
        } else {
            if (currentValue instanceof Array) { // Populate checkboxes from Array
                for (var j = 0; j < currentValue.length; j++) {
                    $ejsForm.find('[name=\'' + currentName + '\']' + '[value=\'' + currentValue[j] + '\']').attr('checked', true);
                }
            } else { // If not an array, populate single checkbox
                $ejsForm.find('[name=\'' + currentName + '\']' + '[value=\'' + currentValue + '\']').attr('checked', true);
            }
        }
    }
}

function editItem(event) {
    event.preventDefault();

    var data = new FormData(),
    url = '/search', // Use search to look up the item's current values
    method = 'POST',
    itemId = $(this).attr('data-id'),
    $ejsForm = $(new EJS({url: 'views/editItem.ejs'}).render({itemId: itemId}));

    data.append('_id', itemId); // Look up by id

    $.ajax({
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: method,
        success: function (data) {

            getFormSettingsThen(function (formSettings) {
                $ejsForm.find('#inputs').html(renderForm(formSettings));
                setEditValues(formSettings, data, $ejsForm); // Populate the form with the current values

                $.colorbox({
                    open: true, // Open the lightbox immediately.
                    href: $ejsForm, // Show this html.
                    inline: true, // Use html.
                    innerWidth: 640,
                    innerHeight: 390, // Set size of frame.
                    opacity: 0
                });

                $('#editItemForm').submit(updateItem);
                $('#deleteBtn').click(deleteItem);
            });
        }
    });
}

function goBack(event) { // Remove the single item page and unhide the search results

    $('#singleItemDiv').remove();
    $('#searchDiv').removeClass('hidden');
}

function openUpdatedItemPage(itemId) { // Once updates are made, reflect them on the single item page

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
                // Set updated to true on EJS to reveal 'Updated' text
                ejsResult = new EJS({url: 'views/singleItem.ejs'}).render({formSettings: formSettings, singleItem: singleItem});
                $('#singleItemDiv').remove();
                $body.append(ejsResult);
                $('#updated').removeClass('hidden');
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