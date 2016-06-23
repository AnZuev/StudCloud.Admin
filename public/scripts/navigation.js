var Nav = {
	moveToUsers: function (item) {
		NavLibs.hideAllTabs();
		$("#usersTab").show(200);
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
		$("#staticDataTab").show(200);
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