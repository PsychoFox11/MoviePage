'use strict';

function loadSearch() {
    $('#searchForm').submit(submitForm);
    $('#format').change(toggle3d);
    $('#advancedLink').click(toggleAdvanced);
    $('#basicLink').click(toggleAdvanced);

    generateYears();
}


function toggleAdvanced(event) {
    console.log('advanced toggled');
    $('#basicButtons').toggleClass('hidden');
    $('#advanced').toggleClass('hidden');
}

function toggle3d(event) {
    console.log('changed ' + this.value);
    if (this.value === 'bluray') {
        $('#span3d').removeClass('hidden');
        return;
    } else {
        $('#span3d').addClass('hidden');
        return;
    }
}

function generateYears() {
    var htmlString = '',
    year = new Date().getFullYear(),
    dropdown = $('#year');
    console.log(year);

    for (var i = year; i > 1899; i--) {
        htmlString += '<option value=\"' + i + '\">' + i + '</option>';
    }

    htmlString += '<option value=\"older\">Before 1900</option>';
    dropdown.html(htmlString);
    return;
}

function submitForm(event) {
    event.preventDefault();

    var data = new FormData(this),
    xhr = new XMLHttpRequest(),
    url = this.action,
    method = 'POST';
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
            $('#outputDiv').html(data);
        }
    });
}

module.exports = loadSearch;