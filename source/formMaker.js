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

function renderForm(searchTypes, mode) { // Mode should be 'simple' or 'advanced', pass nothing for all
    var type = '',
    html = '',
    currentKey, i, j, text, values, htmlTemp, name, dataType, step;

    // Generate html for form inputs
    for (j = 0; j < searchTypes.length; j++) {
        currentKey = searchTypes[j];

        if (!currentKey.name || !currentKey.type) { // Must have name and type
            continue;
        } else if (typeof currentKey.order !== 'number') { // If no valid order, end of relavent list since sort puts those at the end
            break;
        }

        if ((mode === 'simple') && (currentKey.advanced)) {
            break;
        } else if ((mode === 'advanced') && (!currentKey.advanced)) {
            continue;
        }


        name = currentKey.name;
        type = currentKey.type;
        dataType = currentKey.dataType;
        values = currentKey.values ? currentKey.values : null; // Values must always be an array, even if only one element
        html += '<span>';

        switch (type) {

            case 'text': {
                html += name + ': </span><input type=\"text\" name=\"' + name + '\"></input>';
                break;
            }

            case 'year': {
                var years;
                html += name + ': </span><select name=\"' + name + '\">';
                if (values) {
                    if (values instanceof Array) {
                        years = generateYears(values[0], values[1]);
                    }
                } else {
                    years = generateYears();
                }

                html += '<option value=\"\"></option>';
                for (i = 0; i < years.length; i++) {
                    html += '<option value=\"' + years[i] + '\">' + years[i] + '</option>';
                }
                html += '</select>';
                break;
            }

            case 'dropdown': {
                html += name + ': </span><select name=\"' + name + '\">';
                html += '<option value=\"\"></option>';
                for (i = 0; i < values.length; i++) {
                    html += '<option value=\"' + values[i] + '\">' + values[i] + '</option>';
                }
                html += '</select>';
                break;
            }

            case 'checkbox': {
                html += name + ': </span>';
                for (i = 0; i < values.length; i++) {
                    html += '<input type=\"checkbox\" name=\"' + name + '\" + value=\"' + values[i] + '\">' + values[i] + ' </input>';
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
                step = dataType === 'float' ? 0.01 : 1;
                html += '<input type=\"number\" name=\"' + name + '\" step=\"' + step + '\"' + htmlTemp + '></input>';
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