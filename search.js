function main() {
	$('#format').change(toggle3d);
	$('#advancedLink').click(toggleAdvanced);
	$('#basicLink').click(toggleAdvanced);


	generateYears();
}

function toggleAdvanced(event) {
	//event.preventDefault();
	console.log('advanced toggled');
	$('#advancedLink').toggleClass('hidden');
	$('#advanced').toggleClass('hidden');
}

function toggle3d(event) {
	console.log("changed " + this.value);
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

$(main);