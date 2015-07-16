/* global jon, EJS*/
'use strict';

var jon = require('./jonslibrary.js');

function loadUpload() {
    $('#file').on('change', loadFile);
}

function loadFile(event) {
    var f = event.target.files[0],
    reader, contents;

    if (f) {
        reader = new FileReader();
        reader.onload = function (event) {
            contents = event.target.result;
            // Convert to json and populate table
            uploadTable(jon.tsv2json(contents));
        };
        reader.readAsText(f);
    } else {
        alert('failed to load file');
    }
}

function uploadTable(objects) {
    var data = new FormData(),
    action = '/upload',
    method = 'POST',
    returnedObjs = [];

    data.append('jsonDb', JSON.stringify(objects));

    $.ajax({
        url: action,
        data: data,
        contentType: false,
        processData: false,
        method: method,
        success: function (res) {
            returnedObjs = JSON.parse(res.jsonDb);
            drawTable(returnedObjs);
            createEditForm(returnedObjs);
        },
        error: function (err) {
            $('#outputDiv').html(err);
        }
    });
}

function drawTable(objects) {
    var result = new EJS({url: 'views/table.ejs'}).render({objects: objects});

    $('#outputDiv').empty();
    $('#outputDiv').append(result);
}

function createEditForm(objects) {
    var $form = $('#addItemForm'),
    $formDiv = $('#addItem'),
    html = '';

    // Add inputs - should probably move to ejs
    for (var key in objects[0]) {
        html += '<span>' + key + ': </span><input type=\"text\" name=\"' + key + '\"><br><br>';
    }
    // Clear form
    $formDiv.empty();
    // Add html to form
    $formDiv.append(html);
    // Unhide form
    $form.removeClass('hidden');
    // Submit form and pass it object array (best method?)
    $form.submit({objects: objects}, addItem);
}

function addItem(event) {
    event.preventDefault();
    event.stopPropagation();

    // Objects was passed in by listener
    var objects = event.data.objects,
        // Get form data
        elements = event.target,
        newObj = {},
        el, key;

    // Set propeties in object in case new object doesn't have all parts filled out
    for (key in objects[0]) {
        newObj[key] = '';
    }

    // Aet object values. el.name should match object keys from above as they both come from the uploaded file header.
    for (var i = 0; (el = elements[i++]);) {
        // Don't include submit values
        if (el.type !== 'submit') {
            newObj[el.name] = el.value;
        }
    }

    // Add object to array
    objects.push(newObj);

    // Redraw table
    createEditForm(objects);
    drawTable(objects);

}

module.exports = loadUpload;
