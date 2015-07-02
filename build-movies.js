var file200= 'JonMovies.tsv',
movieList = [],
headerObj, rawList, header, lineSplit;


function movieObj (title, is3D, notes, loaned) {
	this.title = title;
	this.is3D = is3D;
	this.notes = notes;
	this.loaned = loaned;
}

function ajaxMain() {
	$("#searchBtn").click(lookUp);
	jqueryFetch();
	console.log('ajaxmain ' + movieList.length)
}

function jqueryFetch() {
	$.get(file200, function (data) {
		rawList = data;
			//$('#jquery').html(data);
			buildHeader(rawList);
			buildObjects();
			buildGrid(movieList);
		});
}

function lookUp(event) {
	var searchText = $('#searchText').val();
	console.log(searchText);
	var resultGrid = $('#results');
	drawHeader(resultGrid);
	drawRow(searchText, resultGrid);
}

function drawRow(movieNum, table) {
	var output = '<tr>';

	for (var key in movieList[movieNum]) {
		output += '<td>' + movieList[movieNum][key] + '</td>';
	}

	output += '</tr>';
	table.append(output);
}
/*function jqueryFetch() {

	$.ajax(file200, {method: 'GET'})
	.done(function (data) {
		rawList = data;
		buildHeader(rawList);
		buildObjects();
	})
	.fail(function (err) {
		$('#jquery').html(err.status + ': ' + err.statusText);
	});
}*/

function drawHeader(table) {
	var columnData = '<tr>';
	for (i = 0; i < header.length; i++) {
		columnData += ('<th>' + header[i] + '</th>');
	}
	columnData += '</tr>';
	table.append(columnData);
}

function buildHeader(listName) {
	if (rawList) {
		lineSplit = listName.split("\n");
		header = lineSplit[0].split("\t");
	}
}

function buildObjects() {
	var singleLine, i;
	for (i = 1; i < lineSplit.length; i++) {
		singleLine = lineSplit[i].split("\t");
		movieList.push(new movieObj(singleLine[0], singleLine[1], singleLine[2], singleLine[3]));
	}
	console.log('in buildObjects ' + movieList.length);
	for (var key in movieList[156]) {
		console.log(key + ' ' + movieList[156][key]);
	}
}


function buildGrid(list) {
	var key, 
	columnData = '',
	table = $('#movieTable');
	//table.append('<tr><td>hello</td></tr>');

	columnData = '<tr>';
	for (i = 0; i < header.length; i++) {
		columnData += ('<th>' + header[i] + '</th>');
	}
	columnData += '</tr>';
	table.append(columnData);


	for (i = 1; i < list.length; i++) {
		columnData = '<tr>';
		for (key in list[i]) {
			columnData += ('<td>' + i + ' ' + key + ': ' + list[i][key] + '</td>');
		}
		columnData += '</tr>';
		table.append(columnData);
	}
}

/*function xhrFetch() {
	var xhrEl = document.getElementById('xhr'),
	xhr = new XMLHttpRequest();

	xhr.onerror = function (event) {
		xhrEl.innerHTML = xhr.statusText;
	};

	xhr.onreadystatechange = function (event) {
		if (xhr.DONE === xhr.readyState && 200 === xhr.status) {
			xhrEl.innerHTML = xhr.responseText;
		} else {
			xhrEl.innerHTML = 'Error: ' + xhr.statusText;
		}
	};

	xhr.open('GET', file200);
	xhr.send();
}*/


$(ajaxMain);
