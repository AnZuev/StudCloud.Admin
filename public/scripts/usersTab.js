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
		console.log(clicked.getAttribute('data-value'));
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

	}
	function moveToResultsTable(){
		overviewElem.hide();
		searchForm.hide();
		$(resultsTable).show();

	}
	this.getElem = getElem;
	this.setElem = setElem;
	this.setResultsTable = setResultsTable;
	this.setSearchForm = setSearchForm;
	this.setNavElement = setNavElement;
	this.setOverview = setOverview;

}

function SearchForm(){
	var elem;
	var university;
	var faculty;
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
}

UsersTab.prototype.renderResults = function(options){
	if(options.body.length == 0) return;
	var tbody = document.createElement('tbody');
	options.body.forEach(function(row){
		var tr = document.createElement('tr');
		row.forEach(function(value){
			var td = document.createElement('td');
			td.textContent = value;
			tr.appendChild(td);
		})
		tbody.appendChild(tr);
	})
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

	this.getNavElem = getNavElem;
	this.setNavElement = setNavElement;
	this.eventHandler = eventHandler;
}

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
		span.textContent = "Обновить";
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
	function update(){

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
			   	},
			   	401: function(){

			   	},
				404: function(){
					while(elem.children.length > 1){
						elem.removeChild(elem.children[elem.children.length-1]);
					}
					showError();
				},
			   	500: function(){
			    
			    }
			}
		});
	}

	this.getElem = getElem;
	this.update = update;
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

