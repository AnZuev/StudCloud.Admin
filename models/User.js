var crypto  = require('crypto');
var connection = require('../libs/mainDBMongoose'),
	mongoose = require('mongoose');
    Schema = mongoose.Schema;
var util = require('util');


var async = require('async');

var log = require('../libs/log')(module);



var User = new Schema({
    auth: {
        mail:{
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

    pubInform:{
        name:{
            type:String,
            require: true
        },
        surname:{
            type:String,
            require: true
        },
        photo:{
            type: String,
            require: false,
            default: ''
        },
        university:{
            type: Schema.Types.ObjectId,
            require: true
        },
        faculty:{
	        type: Schema.Types.ObjectId,
            require:true
        },
        group:{
            type: String,
            require: false
        },
        year:{
            type: Number,
            require:true
        }
    },

    prInform:{
        mail:{
            type: String
        },
        phone:{
            type: String
        }
    },

    privacy:{
        blockedUsers:[Schema.Types.ObjectId]
    },

    contacts:[{
	    id:Schema.Types.ObjectId,
	    updated: {
		    type:Date,
		    default:Date.now()
	    },
	    _id:0
    }],

    projects:[{}],

	settings:{
		im:[
			{
				convId: Schema.Types.ObjectId,
				notification: Boolean,
				tag:{
					title:String,
					color: String
				},
				_id:0
			}
		]
	},

    searchString:{
        type:String,
        require: true
    },
	activation:{
		activated: {
			type: Boolean,
			default: false
		},
		key:{
			type: String
		},
		passwordKey:{
			type: String
		}
	},
	created:{
		type: Date,
		default: Date.now()
	}
});






User.statics.getPeopleByGroupNumber = function(group,university, callback){
	this.aggregate([
		{
			$match:{
				"pubInform.group": group,
				"pubInform.university": university
			}
		},
		{
			$project:
			{
				_id: "$_id"
			}
		}
	],function(err, users){
		if(err){
			return callback(err);
		}else{
			return callback(null, users);
		}
	})

};


User.statics.getUserById = function(userId, callback){
    this.findById(userId, function(err, user){
        if(err) return callback(new dbError(err, null, null));
        else{
            if(user) return callback(null, user);
            else return callback(null, false);

        }
    });
};

User.statics.getNewUsers = function(age, callback){
	this.count({created:{$gte: age.toISOString()} }, function(err, counter){
		if(err){
			return callback(null, -1);
		}else{
			return callback(null, counter);
		}
	})
};
User.statics.countUsers = function(callback){
	this.find({}, function(err, counter){
		if(err){
			console.error(err);
			return callback(null, -1);
		}else{
			return callback(null, counter);
		}
	})
}

User.statics.getActivatedUsers = function(age, callback){
	this.count({created:{$gt: age} , "activation.activated": true}, function(err, counter){
		if(err){
			console.error(err);
			return callback(null, -1);
		}else{
			return callback(null, counter);
		}
	})
};

User.statics.getStaticsByUniversity = function(callback){
	this.aggregate([
		{
			$group:{
				_id: "$pubInform.university",
				counter:{$sum: 1}
			}
		}
	], callback);
};



User.statics.getUsersBy = function(context, callback){
	this.aggregate([
		{
			$match: context
		},
		{
			$project:{
				name: "$pubInform.name",
				surname: "$pubInform.surname",
				mail: "$auth.mail",
				university: "$pubInform.university",
				faculty: "$pubInform.faculty",
				year: "$pubInform.year",
				group: "$pubInform.group",
				_id: "$_id"
			}
		}
	], callback);
};

exports.User = connection.model('User', User);




