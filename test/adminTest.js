var Admin = require("../models/Admin").Admin;


/*Admin.addAdmin("GPopov", "adminPWD", function(err, result){
	console.log(arguments)
});*/

/*Admin.grantAllRights("AnZuev", function(err, res){
	console.log(arguments);
})*/

Admin.setRole("AnZuev", "GPopov", "so-so", function(err, res){
	console.log(arguments);
});
console.log("done");