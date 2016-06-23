function UsersTab () {
	var elem,
		resultsTable,
		searchForm,
		navElem,
		overviewElem;

	function getElem(){
		return elem;
	}

	function setElem(newElem){
		elem = newElem;
		elem.onclick = eventHandler;
	}

	function setResultsTable(newTable){
		resultsTable = newTable;
	}

	function setSearchForm(newSearchForm){
		searchForm = new SearchForm();
		searchForm.setElem(newSearchForm);
	}

	function setNavElement(newNavElem){
		navElem = new Navigation();
		navElem.setNavElement(newNavElem);
	}

	function setOverview(newOverview){
		overviewElem = new Overview(window.usersTab.widgets);
		overviewElem.setElem(newOverview);
	}

	function eventHandler(event){
		var clicked = event.target.closest('.childTab');
		var action = {};
		switch(clicked.getAttribute('data-value')){
			case "navigation":
				action = navElem.eventHandler(event);
				if(action.action == 'goToSearchResults'){
					moveToResultsTable();
				}else if(action.action == "goToSearchForm"){
					moveToSearchForm();
				}else if(action.action == "goToOverview"){
					moveToOverviewTab();
				}else{

				}
				break;
			case "searchForm":
				action = searchForm.eventHandler(event);
				if(action.action == "initUsersSearch"){
					var searchContext = searchForm.collectData();
					searchForm.initSearch(searchContext);
				}
				break;
			case "resultsTable":
				break;

			case "overview":

				break;


			}
			return true;
		}

	function moveToSearchForm(){
		$(resultsTable).hide();
		overviewElem.hide();
		searchForm.show();
	}

	function moveToOverviewTab(){
		searchForm.hide();
		$(resultsTable).hide();
		overviewElem.show();
		overviewElem.update();

	}

	function moveToResultsTable(){
		overviewElem.hide();
		searchForm.hide();
		$(resultsTable).show();

	}

	function updateResultsTable(newTbody){
		var thead = resultsTable.children[1].children[0];
		resultsTable.children[1].innerHTML = '';
		resultsTable.children[1].appendChild(thead);
		resultsTable.children[1].appendChild(newTbody);
	}

	this.getElem = getElem;
	this.setElem = setElem;
	this.setResultsTable = setResultsTable;
	this.setSearchForm = setSearchForm;
	this.setNavElement = setNavElement;
	this.setOverview = setOverview;


	function SearchForm(){
		var elem;
		var university;
		var faculty;
		var self = this;
		function getElem(){
			return elem;
		}
		function setElem(element){
			elem = element;
		}

		function eventHandler(event){
			if (event.target.closest('.btn-success')) {
				return {action: 'initUsersSearch'}
			}else{
				return {};
			}
		}

		function collectData(){
			var searchContext = {};
			try{
				if($('#usersSearchUniversity').val().length > 0){
					searchContext.university = university.id;
				}
			}catch(e){

			}
			try{
				if($('#usersSearchFaculty').val().length > 0){
					searchContext.faculty = faculty.id;
				}
			}catch(e){

			}
			try{
				searchContext.year = $("#usersSearchYear").val();
			}catch(e){

			}
			var activated = $("#usersSearchTabActivatedCheckbox").is(":checked");
			var notActivated = $("#usersSearchTabNotActivatedCheckbox").is(":checked");

			if(activated){
				searchContext.activated = true;
			}
			if(notActivated){
				searchContext.notActivated = true;
			}
			return searchContext;
		}
		function initSearch(searchContext){
			$.ajax({
				url: window.host + "/um/getUsersBy",
				type: 'GET',
				dataType: 'JSON',
				data: searchContext,
				success: function(data) {
					var tbody = self.renderResults(data);
					navElem.click('searchResults');
					updateResultsTable(tbody);
				}
			});
		}

		function setTypeAheads(){
			$("#usersSearchUniversity").typeahead({
				source: function (query, process) {
					$.ajax({
						url: "http://pre-api.istudentapp.ru/universities/getUniversities",
						type: 'GET',
						dataType: 'JSON',
						data: 'title=' + query,
						success: function(data) {
							process(data);
						}
					});
				},
				displayText: function(item){ return item.title;},
				updater: function(item) {
					university = item;
					return item;
				},
				hint: true,
				highlight: true
			}).on('keyup', this, function (event) {
				if (event.keyCode == 13) {
					$('#usersSearchUniversity').typeahead('close');
				};
			});

			$("#usersSearchFaculty").typeahead({
				source: function (query, process) {
					$.ajax({
						url: "http://pre-api.istudentapp.ru/universities/getFaculties",
						type: 'GET',
						dataType: 'JSON',
						data: 'title=' + query +"&university="+university.id,
						success: function(data) {
							process(data);
						}
					});
				},
				displayText: function(item){ return item.title;},
				updater: function(item) {
					faculty = item;
					return item;
				},
				hint: true,
				highlight: true
			}).on('keyup', this, function (event) {
				if (event.keyCode == 13) {
					$('#input').typeahead('close');
				}
			})
		}
		function removeTypeAheads(){
			$("#usersSearchUniversity").typeahead('destroy');
			$("#usersSearchFaculty").typeahead('destroy');


		}
		function hide(){
			removeTypeAheads();
			$(elem).hide();
		}
		function show(){
			setTypeAheads();
			$(elem).show();
		}


		this.hide = hide;
		this.show = show;

		this.getElem = getElem;
		this.setElem = setElem;
		this.eventHandler = eventHandler;

		this.collectData = collectData;
		this.initSearch = initSearch;
	}

	SearchForm.prototype.renderResults = function(data){
		if(data.length == 0) return;
		var tbody = document.createElement('tbody');
		data.forEach(function(row){
			var tr = document.createElement('tr');
			tr.setAttribute('data-id', row.id);
			var checkbox = document.createElement('td');
			checkbox.innerHTML = '<input type="checkbox" value="checked">';
			tr.appendChild(checkbox);
			row.body.forEach(function(value){
				var td = document.createElement('td');
				td.textContent = value;
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});
		return tbody;
	}

	function Navigation(){
		var navElem;
		var state = 'overview';

		function getNavElem(){
			return navElem;
		}
		function setNavElement(element){
			navElem = element;
		}
		function eventHandler(event){
			var clicked = event.target.closest('li');
			if(!clicked) return false;

			var attr = clicked.getAttribute('data-value');
			if(state == attr) return false;

			var items = navElem.getElementsByTagName('li');
			for(var index in items){
				var element = items[index];
				if(element.className == 'active' || element.className == '') element.className = '';
				else element.className = 'pull-right';
			}

			if(attr == 'overview'){
				state = attr;
				clicked.className += 'active';
				return {action: 'goToOverview'}
			}else if(attr == 'searchForm'){
				state = attr;
				clicked.className += ' active';
				return {action: 'goToSearchForm'}
			}else if(attr == 'searchResults'){
				state = attr;
				clicked.className += ' active';
				return {action: 'goToSearchResults'}
			}

		}

		function click(target){
			var items = navElem.getElementsByTagName('li');
			for(var index in items){
				var element = items[index];
				try{
					if(element.getAttribute('data-value') == target){
						element.click();
						break;
					}
				}catch(e){

				}
			}
		}
		this.getNavElem = getNavElem;
		this.setNavElement = setNavElement;
		this.eventHandler = eventHandler;

		this.click = click;
	}

	function Overview(widgets){
		var statsWidgets = [];
		var elem;
		function getElem(){
			return elem;
		}
		function setElem(element){
			elem = element;
			render();
		}

		function reset(){
			elem.empty();
			render();
		}

		function update(){
			statsWidgets.forEach(function(widget){
				widget.update();
			});
		}

		function render(){
			widgets.forEach(function(element){
				statsWidgets.push(new StatsWidget(element));
			});
			statsWidgets.forEach(function(widget){
				elem.appendChild(widget.getElem());
			});

		}

		function show(){
			$(elem).show();
		}
		function hide(){
			$(elem).hide();
		}

		this.getElem = getElem;
		this.setElem = setElem;

		this.update = update;
		this.reset = reset;

		this.show = show;
		this.hide = hide;




	}

}

/*
function SearchForm(){
	var elem;
	var university;
	var faculty;
	var self = this;
	function getElem(){
		return elem;
	}
	function setElem(element){
		elem = element;
	}

	function eventHandler(event){
		if (event.target.closest('.btn-success')) {
	      	return {action: 'initUsersSearch'}
	  	}else{
	  		return {};
	  	}
	}

	function collectData(){
		var searchContext = {};
		try{
			searchContext.university = university.id;
		}catch(e){

		}
		try{
			searchContext.faculty = faculty.id;
		}catch(e){

		}
		try{
			searchContext.year = $("#usersSearchYear").val();
		}catch(e){

		}
		var activated = $("#usersSearchTabActivatedCheckbox").is(":checked");
		var notActivated = $("#usersSearchTabNotActivatedCheckbox").is(":checked");

		if(activated){
			searchContext.activated = true;
		}
		if(notActivated){
			searchContext.notActivated = true;
		}
		return searchContext;
	}
	function initSearch(searchContext){
		$.ajax({
			url: window.host + "/um/getUsersBy",
			type: 'GET',
			dataType: 'JSON',
			data: searchContext,
			success: function(data) {
				var tbody = self.renderResults(data);
				updateResultsTable(tbody);
			}
		});
	}

	function setTypeAheads(){
		$("#usersSearchUniversity").typeahead({
				source: function (query, process) {
		            $.ajax({
			              url: "http://pre-api.istudentapp.ru/universities/getUniversities",
			              type: 'GET',
			              dataType: 'JSON',
			              data: 'title=' + query,
			              success: function(data) {
			                process(data);
			              }
			        });
	        	},
			    displayText: function(item){ return item.title;},
		        updater: function(item) {
			        university = item;
			        return item;
			    },
		        hint: true,
		  		highlight: true
		}).on('keyup', this, function (event) {
	        if (event.keyCode == 13) {
	            $('#usersSearchUniversity').typeahead('close');
	        };
	    });

		$("#usersSearchFaculty").typeahead({
			source: function (query, process) {
		     		    $.ajax({
				              url: "http://pre-api.istudentapp.ru/universities/getFaculties",
				              type: 'GET',
				              dataType: 'JSON',
				              data: 'title=' + query +"&university="+university.id,
				              success: function(data) {
				                process(data);
				              }
			            });
		        	},
		    displayText: function(item){ return item.title;},
		    updater: function(item) {
		               faculty = item;
	                   return item;
            },
		    hint: true,
		  	highlight: true
		}).on('keyup', this, function (event) {
	        if (event.keyCode == 13) {
	            $('#input').typeahead('close');
	        }
    	})
	}
	function removeTypeAheads(){
		$("#usersSearchUniversity").typeahead('destroy');
		$("#usersSearchFaculty").typeahead('destroy');


	}
	function hide(){
		removeTypeAheads();
		$(elem).hide();
	}
	function show(){
		setTypeAheads();
		$(elem).show();
	}


	this.hide = hide;
	this.show = show;

	this.getElem = getElem;
	this.setElem = setElem;
	this.eventHandler = eventHandler;

	this.collectData = collectData;
	this.initSearch = initSearch;
}

SearchForm.prototype.renderResults = function(data){
	if(data.length == 0) return;
	var tbody = document.createElement('tbody');
	data.forEach(function(row){
		var tr = document.createElement('tr');
		row = Array.prototype.slice.call(row);
		row.forEach(function(value){
			var td = document.createElement('td');
			td.textContent = value;
			tr.appendChild(td);
		});
		tbody.appendChild(tr);
	});
	return tbody;
}
*/





function StatsWidget (options) {
	var elem;

	function getElem(){
		if(!elem) render();
		return elem;
	}

	function render(){
		elem = document.createElement('div');
		elem.className = 'list-group col-lg-6';
		if(options.id) elem.id = options.id;

		var titleElem = document.createElement('h5');
		elem.appendChild(titleElem);
		titleElem.textContent = options.title || "Статистика";
		var span = document.createElement('span');
		span.className = "pull-right updateStats text-success";
		var loader = document.createElement('span');
		loader.className = "glyphicon glyphicon-refresh";
		span.appendChild(loader);
		//span.textContent = "Обновить";
		span.style.cursor = 'pointer';
		titleElem.appendChild(span);

		elem.onclick = function(event) {
			if (event.target.closest('.updateStats')) {
				update();
			}
		};

		update();
	}

	function renderRows(){
		var items = options.items || [];
		items.forEach(function(item){
			var span = document.createElement('span');
			span.className = 'list-group-item';
			span.textContent = item.title;

			var badge = document.createElement('span');
			badge.className = 'badge';
			badge.textContent = item.counter;

			span.appendChild(badge);
			elem.appendChild(span);
		})
	}

	function showError(){
		var div = document.createElement('div');
		div.className = 'alert alert-danger';
		div.textContent = 'Не удалось загрузить виджет';
		elem.appendChild(div);
	}

	function showLoader(){
		elem.children[0].lastChild.firstChild.className = "glyphicon glyphicon-refresh glyphicon-refresh-animate";
	}
	function hideLoader(){
		setTimeout(function(){
			elem.children[0].lastChild.firstChild.className = "glyphicon glyphicon-refresh";
		}, 1000);
	}
	function update(){
		showLoader();
		$.ajax({
			url: options.updateUrl,
		    type: 'GET',
	        dataType: 'JSON',
			statusCode:{
			  	200:function(items){
				    while(elem.children.length > 1){
					    elem.removeChild(elem.children[elem.children.length-1]);
				    }
				    options.items = items;
					renderRows();

				    hideLoader();
			   	},
			   	401: function(){
				    hideLoader();
			   	},
				404: function(){
					while(elem.children.length > 1){
						elem.removeChild(elem.children[elem.children.length-1]);
					}
					showError();
					hideLoader();

				},
			   	500: function(){
				    showError();
				    hideLoader();


			    }
			}
		});
	}

	this.getElem = getElem;
	this.update = update;
}


