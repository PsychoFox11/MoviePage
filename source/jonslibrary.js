'use strict';

var jon = {
    tsv2json: function (tsv) {
        var json = [],
        header = [],
        lines = [],
        tempMovie = {},
        singleLine, i, j;

        lines = tsv.split('\n');
        header = lines[0].split('\t');

        for (i = 1; i < lines.length; i++) {
            singleLine = lines[i].split('\t');
            tempMovie = {};
            for (j = 0; j < header.length; j++) {
                tempMovie[header[j]] = singleLine[j];
            }
            json.push(tempMovie);
        }

        return json;
    }
};

module.exports = jon;

// Uncomment below to test with node

/* Testing stuff
var tsvtest = 'column1\tcolumn2\tcolumn3\tcolumn4\nval1\tval2\tval3\tval4\nval11\tval22\tval33\tval44';
var jsonlist = {};

console.log('stuff');
console.log(tsvtest);
jon.tsv2json(tsvtest);
console.log(JSON.stringify(jon.tsv2json(tsvtest)));*/