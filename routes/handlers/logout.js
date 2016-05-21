exports.post = function(req, res, next){
	if(req.session.user){
		req.session.user = null;
	}
	res.end();
	next();
}