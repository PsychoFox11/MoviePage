function main() {
	fetchSidebar();
	$('#searchClick').click(openSearch);
}


function fetchSidebar() {
	var username = 'Jon Walker',
	result = new EJS({url: 'sidebar.ejs'}).render({username: username});
	$('#sideBar').append(result);
}

function openSearch(event) {
	event.preventDefault();
	if ($('#searchDiv').length !== 0){
		return;
	}
	result = new EJS({url: 'search.ejs'}).render();
	$('#mainBody').append(result);
	loadSearch();
}

$(main);