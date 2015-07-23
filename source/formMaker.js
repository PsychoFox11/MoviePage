'use strict';


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
    currentKey, i, text, values, htmlTemp, name;

    for (var key in searchTypes) {

        currentKey = searchTypes[key];
        name = currentKey.name;
        type = currentKey.type;
        values = currentKey.values ? currentKey.values : null;
        html += '<span>';

        switch (type) {

            case 'text': {
                html += name + ': </span><input type=\"text\" name=\"' + name + '\"></input>';
                break;
            }

            case 'year': {
                html += name + ': </span><select name=\"' + name + '\">';
                var years = generateYears();
                for (i = 0; i < years.length; i++) {
                    html += '<option value=\"' + years[i] + '\">' + years[i] + '</option>';
                }
                html += '</select>';
                break;
            }

            case 'dropdown': {
                html += name + ': </span><select name=\"' + name + '\">';
                for (i = 0; i < values.length; i++) {
                    html += '<option value=\"' + values[i] + '\">' + values[i] + '</option>';
                }
                html += '</select>';
                break;
            }

            case 'checkbox': {
                html += name + ': </span>';
                for (i = 0; i < values.length; i++) {
                    html += '<input type=\"checkbox\" name=\"' + name + '\" value=\"' + values[i] + '\">' + values[i] + ' </input>';
                }
                break;
            }

            case 'number': { // Value is array with [min, max]. No value property for unlimited, single value for min, pass null for min for only max.
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
                html += name + text + ': </span>';
                html += '<input type=\"number\" name=\"' + name + '\"' + htmlTemp + '></input>';
                break;
            }

            case 'date': {
                html += name + ': </span><input type=\"date\" name=\"' + name + '\"></input>';
                break;
            }
        }

        html += '<br><br>';
    }

    return html;
}

module.exports = renderForm;

/* Useful artifact function testRender() {
    var searchTypes = {
        Title: {
            type: 'text'
        },
        Year: {
            type: 'year'
        },
        Format: {
            type: 'dropdown',
            values: ['Any', 'Bluray', 'Bluray 3D', 'DVD']
        },
        Visuals: {
            type: 'checkbox',
            values: ['Color', 'Black and White', '3D']
        },
        Length: {
            type: 'number',
            values: [1]
        },
        Released: {
            type: 'date'
        }
    };

    renderForm(searchTypes);
}*/