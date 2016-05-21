var Admin = require("../../models/admin").Admin;

exports.post = function(req, res, next){
	var login = req.body.login,
		password = req.body.password;
	Admin.signIn(login, password, function(err, user){
		if(err){
			next(err);
		}else{
			req.session.user = user._id;
			res.json(user);
			res.end();
		}
	})
}