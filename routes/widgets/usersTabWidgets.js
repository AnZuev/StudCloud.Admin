var getNewUsersStatistics = require('../../libs/middleware/dashboard/getUmNewUserStatics');
var getActivatedToNewStatistics = require('../../libs/middleware/dashboard/getUmActiveToAllStatics');
var getUsersPerUniversity = require('../../libs/middleware/dashboard/getUmUniversityStatics.js');
exports.get = function(req, res, next){
	var widget = req.query.widget;

	switch (widget){
		case "newUsers":
			getNewUsersStatistics(function(err, result){
				if(err){
					return next(err);
				}else{
					res.json(result);
					res.end();
				}
			});
			break;
		case "activated":
			getActivatedToNewStatistics(function(err, result){
				if(err){
					return next(err);
				}else{
					res.json(result);
					res.end();
				}
			});
			break;
		case "usersPerUniversitiesPerWeek":
			getUsersPerUniversity(function(err, result){
				if(err){
					return next(err);
				}else{
					res.json(result);
					res.end();
				}
			});
			break;
		default:
			return next();
	}


};