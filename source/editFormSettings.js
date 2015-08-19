/* global EJS*/
'use strict';

var getFormSettingsThen = require('./getFormSettings.js');

function openFormSettings() {
    getFormSettingsThen(function (formSettings) {

        var $mainBodyDiv = $('#mainBodyDiv'),
        ejsResult, $ejsResult, cutoff;

        for (var i = 0; i < formSettings.length; i++) { // Determine where the cutoff is for Advanced fields.
            if (formSettings[i].advanced) {
                cutoff = i;
                break;
            }
        }

        $ejsResult = $(new EJS({url: 'views/editFormSettings.ejs'}).render({formSettings: formSettings, cutoff: cutoff}));
        $ejsResult.find('#cutoffSelect').append(generateCutoffNumbers(cutoff));
        $mainBodyDiv.empty();
        $mainBodyDiv.append($ejsResult);
        addEditListeners();
    });
}

function addEditListeners() {
    $('.formEditLink').click(openEditBox);
    $('#cutoffBtn').click(saveCutoff);
}

function generateCutoffNumbers(cutoff) {
    var html = '';

    for (var i = 1; i < 100; i++) {
        html += '<option value=\"' + i + '\"';
        if (i === cutoff) {
            html += 'selected';
        }
        html += '>' + i + '</option>';
    }
    return html;
}

function openEditBox (event) {
    event.preventDefault();

    var itemName = $(this).attr('data-name'),
    oldValues = {},
    newValues = {}, // Will come from form submit
    $ejsResult, dataTypeEjs, valueEjs, currentItem;

    getFormSettingsThen(function (formSettings) {
        for (var key in formSettings) {
            if (formSettings[key].name === itemName) {
                currentItem = formSettings[key];
            }
        }

        for (var keys in currentItem) { // Save the existing values for comparison
            oldValues[keys] = currentItem[keys];
            newValues[keys] = currentItem[keys];
        }

        $ejsResult = $(new EJS({url: 'views/editFormItem.ejs'}).render({formItem: currentItem}));
        dataTypeEjs = new EJS({url: 'views/dataTypeSelect.ejs'}).render({formItem: currentItem});
        valueEjs = new EJS({url: 'views/valueSelect.ejs'}).render({formItem: currentItem});


        $ejsResult.find('#dataTypeSelect').append(dataTypeEjs);
        $ejsResult.find('#valueSelect').append(valueEjs);

        $.colorbox({
            open: true, // Open the lightbox immediately.
            href: $ejsResult, // Show this html.
            inline: true, // Use html.
            innerWidth: 640,
            innerHeight: 390, // Set size of frame.
            opacity: 0
        });

        $('#typeSelector').val(currentItem.type);

        if (currentItem.type === 'number') {
            $('#numberSelector').val(currentItem.dataType);
        }

        $('#typeSelector').change(function (event) {
            changeTypes(event, newValues);
        });

        $('#editFormItem').submit(function (event) {
            event.preventDefault();
            updateItem(oldValues, formSettings);
        });
    });
}

function changeTypes(event, newValues) {
    var dataTypeEjs, valueEjs;

    newValues.type = $('#typeSelector').val();
    delete newValues.values;

    $('#dataTypeSelect').empty();
    $('#valueSelect').empty();
    dataTypeEjs = new EJS({url: 'views/dataTypeSelect.ejs'}).render({formItem: newValues});
    valueEjs = new EJS({url: 'views/valueSelect.ejs'}).render({formItem: newValues});

    $('#dataTypeSelect').append(dataTypeEjs);
    $('#valueSelect').append(valueEjs);
}

function updateItem(oldValues, formSettings) {
    var newValues = {},
    newItem = new FormData(),
    destroy = false,
    updateType = '',
    orderSelect = false,
    numberMin, numberMax, valueText;

    newValues.name = $('#nameInput').val();

    if (newValues.name === '') {
        alert('Name cannot be blank');
        return;
    }

    if (oldValues.name !== newValues.name) {
        for (var k = 0; k < formSettings.length; k++) {
            if ((formSettings[k].name === newValues.name) && (oldValues.order !== formSettings[k].order)) {
                alert('You cannot have two items with the same name.');
                return;
            }
            updateType = 'name';
        }
    }

    newValues.order = $('#orderSelect').val();

    if (oldValues.order !== (+newValues.order)) {
        // JSCS orderChanged = true;
        for (var j = 0; j < formSettings.length; j++) {
            if (formSettings[j].order === (+newValues.order)) {
                alert('There is already an item with that order number. Please correct and try again');
                return;
            }
        }
        if (updateType === 'name') {
            updateType = 'nameOrder';
        } else {
            updateType = 'order';
        }
    }

    newValues.type = $('#typeSelector').val();

    if (newValues.type !== oldValues.type) {
        if (!confirm('Changing Types will erase all data for this field. Are you sure?')) {
            return;
        } else {
            updateType = 'destroy';
        }
    }

    if (newValues.type === 'number') {
        newValues.dataType = $('#dataTypeSelector').val();
        if (oldValues.type === 'number') {
            if (oldValues.type !== newValues.type) {
                if (!confirm('Changing data types will erase all previous data for this field, are you sure?')) {
                    return;
                } else {
                    updateType = 'destroy';
                }
            }
        }
    } else {
        switch (newValues.type) {
            case 'checkbox': {
                newValues.dataType = 'array';
                break;
            }

            case 'dropdown': {
                newValues.dataType = 'string';
                break;
            }

            case 'year': {
                newValues.dataType = 'int';
                break;
            }

            case 'date': {
                newValues.dataType = 'date';
                break;
            }

            case 'text': {
                newValues.dataType = 'string';
            }
        }
    }

    if (newValues.type === 'number' || newValues.type === 'year') {
        numberMin = isNaN($('#numberMin').val()) ? null : $('#numberMin').val();
        numberMax = isNaN($('#numberMax').val()) ? null : $('#numberMax').val();

        if (numberMin === null && numberMax === null) {
            newValues.values = null;
        } else if (numberMax === null) {
            newValues.values = [numberMin];
        } else {
            newValues.values = [numberMin, numberMax];
        }
        if (newValues.values.length === oldValues.values.length) {
            for (var m = 0; m < newValues.values.length; m++) {
                if (newValues.values[m] !== oldValues.values[m]) {
                    updateType = 'destroy';
                }
            }
        } else {
            updateType = 'destroy';
        }
    }


    if (newValues.type === 'checkbox' || newValues.type === 'dropdown') {
        valueText = $('#listValues').val();
        valueText = valueText.split(',');
        if (valueText instanceof Array) {
            newValues.values = [];
            for (var i = 0; i < valueText.length; i++) {
                newValues.values[i] = valueText[i].trim();
            }

            if (oldValues.values instanceof Array) {
                if (oldValues.values.length > newValues.values.length) {
                    updateType = 'destroy';
                } else {
                    for (i = 0; i < oldValues.length; i++) {
                        if (oldValues[i] != newValues[i]) {
                            updateType = 'destroy';
                        }
                    }
                }
            }
        }
    }

    if (newValues.type === 'text' || newValues.type === 'date') {
        newValues.values = '';
    }

    if (updateType == 'destroy') {
        if (!confirm('Data will be destroyed, are you sure?')) {
            return;
        }
    }

    console.log('new item');
    console.log(JSON.stringify(newValues));

    for (var key in newValues) {
        newItem.append(key, newValues[key]);
    }
    console.log('update type');
    console.log(updateType);
    newItem.append('updateType', updateType);
    newItem.append('oldName', oldValues.name);

    if (updateType) {
        sendUpdate(newItem);
    }
}

function sendUpdate(newItem) {
    var url = '/updateFormSettings',
    method = 'POST';

    $.ajax({
        url: url,
        data: newItem,
        cache: false,
        contentType: false,
        processData: false,
        method: method,
        success: function (data) {
            $.colorbox.close();
            saveCutoff();
            openFormSettings();
        }
    });
}

function saveCutoff (event) {
    if (event) {
        event.preventDefault();
    }

    var newCutoff = parseInt($('#cutoffSelect').val()),
    data = new FormData(),
    url = '/updateAdvancedCutoff',
    method = 'POST';

    data.append('cutoff', newCutoff);

    $.ajax({
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: method,
        success: function (data) {
            $('#cutoffUpdated').removeClass('hidden');
            $('#cutoffSpan').html(newCutoff);
            $('#cutoffSelect').empty();
            $('#cutoffSelect').append(generateCutoffNumbers(newCutoff));
            setInterval(function () {
                $('#cutoffUpdated').addClass('hidden');
            }, 5000);
        }
    });
}

module.exports = openFormSettings;