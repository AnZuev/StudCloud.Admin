var User = require("../../models/user").User;
var mongoose = require("mongoose");


exports.get = function(req, res, next){
	var context = {};
	try{
		if(req.query.university){
			if(req.query.university.length> 0){
				context["pubInform.university"] = mongoose.Types.ObjectId(req.query.university);
			}
		}
		if(req.query.faculty){
			if(req.query.faculty.length> 0){
				context["pubInform.faculty"] = mongoose.Types.ObjectId(req.query.faculty);
			}
		}
		if(req.query.year > 0){
			context["pubInform.year"] = parseInt(req.query.year);
		}

		if(req.query.activated && req.query.notActivated){

		}else if(req.query.activated){
			context["activation.activated"] = true;
		}else if(req.query.notActivated){
			context["activation.activated"] = false;
		}

		User.getUsersBy(context, function(err, users){
			if(err){
				next(err);
			}else{
				var globalResult = [];
				users.forEach(function(user){
					var results = [];
					results.push(user.name);
					results.push(user.surname);
					results.push(user.mail);
					results.push(user.university);
					results.push(user.faculty);
					results.push(user.year);
					results.push(user.group);
					var result = {
						id: user._id,
						body: results
					};
					globalResult.push(result);
				});
				res.json(globalResult);
				res.end();
			}
		})
	}catch(e){
		console.log(e);
		res.json({code: 400, message: "badData error"});
		res.end();
	}

}