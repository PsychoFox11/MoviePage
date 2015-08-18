/* global jon, EJS*/
'use strict';

var renderSearchForm = require('./search.js'),
loadUpload = require('./jsonejs.js'),
renderAddForm = require('./addForm.js'),
openFormSettings = require('./editFormSettings.js');

function main() {
    openLogin();
    $('#signInForm').submit(login);
    fetchSidebar();
    $('#searchClick').click(openSearch);
    $('#uploadClick').click(openUploader);
    $('#addMovie').click(openAddMovie);
    $('#editForm').click(openFormSettings);
}

function login(event) {
    event.preventDefault();

    var username, password;

    username = $('input[name=username]').val();
    password = $('input[name=password]').val();
    console.log(username);
    console.log(password);

    $.post('/login', {username: username, password: password}, function (data) {
        $('#mainHeader').removeClass('noSidebar').addClass('withSidebar');
        $('#loginDiv').addClass('hidden');
        $('#sideBar').removeClass('hidden');
        $('#mainBodyDiv').removeClass('hidden noSidebar').addClass('withSidebar');
        openSearch();
    }).fail(function (err) {
        console.log(err.responseText);
    });
}

function fetchSidebar() {
    var username = 'Jon Walker',
    result = new EJS({url: 'views/sidebar.ejs'}).render({username: username});
    $('#sideBar').append(result);
}

function openEditFormSettings(event) {
    if (event) {
        event.preventDefault();
    }

    openFormSettings();
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

    if (($('#searchDiv').length === 0) || ($('#singleItemDiv').length !== 0)) { // If single item page is displayed, search is hidden
        $('#mainBodyDiv').empty();
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

function openLogin(event) {
    var $body = $('#mainBodyDiv'),
    result;

    if (event) {
        event.preventDefault();
    }
    $body.empty();
    result = new EJS({url: 'views/login.ejs'}).render();
    $body.append(result);

    $('#signupBtn').click(openSignup);
}

function openSignup(event) {
    var $body = $('#mainBodyDiv'),
    result;

    if (event) {
        event.preventDefault();
    }
    $body.empty();
    result = new EJS({url: 'views/signUp.ejs'}).render();
    $body.append(result);

    $('#loginBtn').click(openLogin);
    $('#signUpForm').submit(signUp);
}

function signUp(event) {
    event.preventDefault();

    var username, password, email, firstName, lastName;

    username = $('input[name=username]').val();
    password = $('input[name=password]').val();
    email = $('input[name=email]').val();
    firstName = $('input[name=firstName]').val();
    lastName = $('input[name=lastName]').val();

    console.log(username);
    console.log(password);

    $.post('/signup', {username: username, password: password, email: email, firstName: firstName, lastName: lastName}, function (data) {
        $('#mainHeader').removeClass('noSidebar').addClass('withSidebar');
        $('#loginDiv').addClass('hidden');
        $('#sideBar').removeClass('hidden');
        $('#mainBodyDiv').removeClass('hidden noSidebar').addClass('withSidebar');
        openSearch();
    }).fail(function (err) {
        console.log(err.responseText);
    });
}

$(main);