module.exports = function(req,res, next){
	if(!req.session.user){
		next(401);
	}else{
		return next();
	}
};