var config = require('../../config');
var widgets = require('../../widgets/userTabStatisticsWidgets.json');

exports.pre = function(req, res, next){
	if(req.session.user){
		next();
	}else{
		res.render("login", {
			host: config.get('general:host')
		});
		res.end();
	}

};
exports.get = function(req, res, next){
	res.render("dashboard", {
		host: config.get('general:host'),
		widgets: widgets
	});

};