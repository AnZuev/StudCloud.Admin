var User = require('../../../models/user').User;
var async = require('async');
var util = require('util');
var getNewUsersStatics = require('./getUmNewUserStatics');

module.exports = function(callback){
	async.waterfall(
		[
			function(callback){
				getNewUsersStatics(callback)
			},
			function(allUsers, callback){
				var tasks = [];
				var now = new Date();
				var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				tasks.push(createTaskToGetNewUsersStatics(today));

				var thisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
				tasks.push(createTaskToGetNewUsersStatics(thisWeek));

				var thisMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
				tasks.push(createTaskToGetNewUsersStatics(thisMonth));

				var all = new Date(2015);
				tasks.push(createTaskToGetNewUsersStatics(all));

				async.parallel(tasks, function(err, results){
					if(err) return callback(err);
					else{
						var items = [
							{
								title: "Сегодня",
								counter: util.format('%s / %s ', results[0], allUsers[0].counter)
							},
							{
								title: "За неделю",
								counter: util.format('%s / %s ', results[1], allUsers[1].counter)
							},
							{
								title: "Зв месяц",
								counter: util.format('%s / %s ', results[2], allUsers[2].counter)
							},
							{
								title: "За все время",
								counter: util.format('%s / %s ', results[3], allUsers[3].counter)
							}
						];
						callback(null, items);
					}
				})
			}

		], callback);
};

function createTaskToGetNewUsersStatics(age){
	return function (callback){
		User.getActivatedUsers(age, callback);
	}
}