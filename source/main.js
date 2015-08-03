/* global jon, EJS*/
'use strict';

var renderSearchForm = require('./search.js'),
loadUpload = require('./jsonejs.js'),
renderAddForm = require('./addForm.js');

function main() {
    openSignUp();
    $('#signInForm').submit(login);
    fetchSidebar();
    $('#searchClick').click(openSearch);
    $('#uploadClick').click(openUploader);
    $('#addMovie').click(openAddMovie);
}

function login(event) {
    event.preventDefault();

    $('#mainHeader').removeClass('noSidebar').addClass('withSidebar');
    $('#loginDiv').addClass('hidden');
    $('#sideBar').removeClass('hidden');
    $('#mainBodyDiv').removeClass('hidden noSidebar').addClass('withSidebar');
    openSearch();
}

function fetchSidebar() {
    var username = 'Jon Walker',
    result = new EJS({url: 'views/sidebar.ejs'}).render({username: username});
    $('#sideBar').append(result);
}

function openAddMovie(event) {
    if (event) {
        event.preventDefault();
    }
    if ($('#addItemDiv').length === 0) {
        renderAddForm(); // From addForm.js
    }
}

function openSearch(event) {
    if (event) {
        event.preventDefault();
    }

    if ($('#searchDiv').length === 0) {
        renderSearchForm(); // From search.js
    }
}

function openUploader(event) {
    event.preventDefault();
    var $body = $('#mainBodyDiv'),
    result;

    if ($('#uploadDiv').length !== 0) {
        return;
    }
    $body.empty(); // Clear 'body' div
    result = new EJS({url: 'views/json.ejs'}).render();
    $body.append(result);
    loadUpload(); // From jsonejs.js
}

function openSignUp(event) {
    var $body = $('#mainBodyDiv'),
    result;

    if (event) {
        event.preventDefault();
    }
    $body.empty();
    result = new EJS({url: 'views/login.ejs'}).render();
    $body.append(result);
}



$(main);