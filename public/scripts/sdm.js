jQuery(function($){
	var usersTab = new UsersTab({});
	usersTab.setElem(document.getElementById('usersTab'));
	var children = Array.prototype.slice.call(usersTab.getElem().children);
	children.forEach(function(element){
		switch(element.getAttribute('data-value')){
			case "navigation":
				usersTab.setNavElement(element);
				break;
			case "searchForm":
				usersTab.setSearchForm(element);
				break;
			case "searchResults":
				usersTab.setResultsTable(element);
				break;
			case "overview":
				usersTab.setOverview(element);
				break;
		}
	});
})