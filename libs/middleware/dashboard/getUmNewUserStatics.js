var User = require('../../../models/user').User;
var async = require('async');

module.exports = function(callback){
	var tasks = [];
	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	tasks.push(createTaskToGetNewUsersStatics(today));

	var thisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
	tasks.push(createTaskToGetNewUsersStatics(thisWeek));

	var thisMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
	tasks.push(createTaskToGetNewUsersStatics(thisMonth));

	var all = new Date(1970, 0);
	tasks.push(createTaskToGetNewUsersStatics(all));


	async.parallel(tasks, function(err, results){
		if(err) return callback(err);
		else{
			var items = [
				{
					title: "Сегодня",
					counter: results[0]
				},
				{
					title: "За неделю",
					counter: results[1]
				},
				{
					title: "За месяц",
					counter: results[2]
				},
				{
					title: "За все время",
					counter: results[3]
				}
			];

		}
		return callback(null, items);
	})
};

function createTaskToGetNewUsersStatics(age){
	return function (callback){
		User.getNewUsers(age, callback);
	}
}