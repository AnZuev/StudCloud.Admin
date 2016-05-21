var crypto  = require('crypto');
var connection = require('../libs/adminDBMongoose'),
	mongoose = require('mongoose');
    Schema = mongoose.Schema;
var util = require('util');


var async = require('async');
var log = require('../libs/log')(module);


var Admin = new Schema({
    auth: {
        login:{
            require: true,
            type: String,
            unique: true
        },
        hashed_password:{
            type:String,
            require: true
        },
        salt:{
            type:String,
            require: true
        }
    },
	role:{
		type:String,
		default: "view"
	}
});



Admin.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1',this.auth.salt).update(password).digest("hex");
};

Admin.virtual('auth.password')
    .set(function(password) {
        this.auth._plainPassword = password;
        this.auth.salt = Math.random() + "";
        this.auth.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword;} );

Admin.methods.checkPassword = function(password){
    return (this.encryptPassword(password) === this.auth.hashed_password);
};

Admin.statics.signIn = function(login, password, callback){
    var User=this;
    async.waterfall([
        function(callback){
            User.findOne({"auth.login": login}, callback)
        },
        function(user, callback){
            if(user){

                if(user.checkPassword(password)){
					return callback(null, user);
                }else{
                    callback(401);
                }
            }else{
                callback(401);
            }
        }
    ],function(err, user){
        if(err){
            return callback(err)
        }
        return callback(null, user);
    });
};

Admin.statics.addAdmin = function(login, password, callback){
	var newAdmin = new this({
		auth:{
			login: login,
			password: password
		}
	});
	newAdmin.save(function(err){
		if(err) {
			return callback(err);
		}
		else {
			return callback(null, true);
		}
	});
};

Admin.statics.setRole = function(requesterLogin, login, role, callback){
	var admin = this;
	async.waterfall([
		function(callback){
			admin.findOne({"auth.login": requesterLogin}, callback);
		},
		function(admin, callback){
			if(admin.role != "all"){
				return callback("Not enough rights");
			}else{
				return callback(null);
			}
		},
		function(callback){
			admin.update({"auth.login": login}, {role: role}, callback);
		}
	], function(err, result){
		if(err) return callback(err);
		else{
			if(result.nModified == 1){
				return callback(null, true);
			}else{
				return callback(null, false);
			}
		}
	})
}

Admin.statics.grantAllRights = function(login, callback){
	this.update({"auth.login": login}, {role: "all"}, callback);
};
exports.Admin = connection.model('Admin', Admin);




