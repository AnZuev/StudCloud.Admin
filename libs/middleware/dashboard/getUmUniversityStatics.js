var User = require('../../../models/user').User;
var async = require('async');
var university = require('../../../models/university').university;

module.exports = function(callback){
	async.waterfall([
		function(callback){
			User.getStaticsByUniversity(callback)
		},
		function(statics, callback){
			if(statics.length > 0){
				var tasks = [];
				statics.forEach(function(element){
					tasks.push(createTaskToGetUniversityName(element._id));
				});
				async.parallel(tasks, function(err, result){
					if(err){
						return callback(err);
					}else{
						statics.forEach(function(element, index){
							statics[index].title = result[index];
						})
					}
					console.log(statics);
					return callback(null, statics);
				});
			}else{
				return callback(null, null);
			}


		}
	], callback);
};

function createTaskToGetUniversityName(id){
	return function (callback){
		university.getUniversityName(id, callback);
	}
}