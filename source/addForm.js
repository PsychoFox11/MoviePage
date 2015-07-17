'use strict';

function testRender() {
    var searchTypes = {
        Title: {},
        Year: {},
        Format: {},
        Visuals: {},
        Length: {}
    };

    searchTypes.Title.type = 'text';
    searchTypes.Year.type = 'year';
    searchTypes.Format.type = 'dropdown';
    searchTypes.Format.values = ['Any', 'Bluray', 'Bluray 3D', 'DVD'];
    searchTypes.Visuals.type = 'checkbox';
    searchTypes.Visuals.values = ['Color', 'Black and White', '3D'];
    searchTypes.Length.type = 'number';
    searchTypes.Length.values = [0, 400];
    renderForm(searchTypes);

    /* Capital letter for comments
    searchTypes['Starring'].type = 'textArray';
    searchTypes['Format'].type = 'checkbox';
    searchTypes['Format'].values = ['DVD', 'Bluray', 'Bluray 3D'];
    searchTypes['Package'].type = 'dropdown';
    searchTypes['Package'].values = ['DVD', 'Bluray', 'Box Set'];*/
}

function generateYears(min, max) {
    var years = [];

    min = min ? min : 1900;
    max = max ? max : new Date().getFullYear();

    for (var i = max; i >= min; i--) {
        years.push(i);
    }

    return years; // Returns from greatest to smallest
}

function renderForm(searchTypes) {
    var type = '',
    html = '',
    currentKey, i, text, values, htmlTemp;

    for (var key in searchTypes) {

        currentKey = searchTypes[key];
        type = currentKey.type;
        values = currentKey.values ? currentKey.values : null;
        html += '<span>';

        switch (type) {

            case 'text': {
                html += key + ': </span><input type=\"text" name=\"' + key + '\"></input>';
                break;
            }

            case 'year': {
                html += key + ': </span><select name=\"' + key + '\">';
                var years = generateYears();
                for (i = 0; i < years.length; i++) {
                    html += '<option value=\"' + years[i] + '\">' + years[i] + '</option>';
                }
                html += '</select>';
                break;
            }

            case 'dropdown': {
                html += key + ': </span><select name=\"' + key + '\">';
                for (i = 0; i < values.length; i++) {
                    html += '<option value=\"' + values[i] + '\">' + values[i] + '</option>';
                }
                html += '</select>';
                break;
            }

            case 'checkbox': {
                html += key + ': </span>';
                for (i = 0; i < values.length; i++) {
                    html += '<input type=\"checkbox\" name=\"' + key + '\" value=\"' + values[i] + '\">' + values[i] + ' </input>';
                }
                break;
            }

            case 'number' : { // Value is array with [min, max]. No value property for unlimited, single value for min, pass null for min for only max.
                text = '';
                htmlTemp = '';
                if (values && (values.length > 0)) {
                    if (values.length === 2) {
                        if (values[0] !== null) {
                            text = ' (' + values[0] + '-' + values[1] + ')';
                            htmlTemp += ' min=\"' + values[0] + '\" max=\"' + values[1] + '\"';
                        } else {
                            text = ' (Max: ' + values[1] + ')';
                            htmlTemp += ' max=\"' + values[1] + '\"';
                        }
                    } else {
                        text = ' (Min: ' + values[0] + ')';
                        htmlTemp += ' min=\"' + values[0] + '\"';
                    }
                }
                html += key + text + ': </span>';
                html += '<input type=\"number\" name=\"' + key + '\"' + htmlTemp + '></input>';
                break;
            }
        }

        html += '<br><br>';
    }

    $('#addInputs').html(html);
}

module.exports = testRender;