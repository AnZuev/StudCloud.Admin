var Nav = {
	moveToUsers: function (item) {
		UM.init();
		NavLibs.hideAllTabs();
		$("#globalUsersTab").show(200);
	},
	moveToBZ:function(){
		NavLibs.hideAllTabs();
		$("#globalBZTab").show(200);
	},
	moveToIM: function(){
		NavLibs.hideAllTabs();

	},
	moveToStaticDataEdit: function(){
		NavLibs.hideAllTabs();

	},
	moveToFB: function(){
		NavLibs.hideAllTabs();

	}
};

var NavLibs = {
	hideAllTabs: function(){
		$(".tabContent").hide(200);
	}
}