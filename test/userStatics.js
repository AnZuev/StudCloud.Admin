var User = require('../models/user').User;
var mongoose = require('mongoose');
var age = new Date(2016, 0);
console.log(age > new Date());

User.getNewUsers(age, function(err, counter){
	console.log(arguments);
});

User.getStaticsByUniversity(function(err, results){
	//console.log(arguments);

});
var context = {
	"pubInform.year": 1

}
User.getUsersBy(context, function(err, result){
	//console.log(arguments);
})
User.countUsers(function(err, result){
	console.log(arguments);
})