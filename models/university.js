var connection = require('../libs/mainDBMongoose'),
	mongoose = require('mongoose');
	Schema = mongoose.Schema;

var util = require('util');
var async = require('async');




var faculty = new Schema({
	title: {
		type: String
	},
	groups:[
		{
			number:{
				type: String
			},
			year:{
				type: Number
			}
		}
	]
});

var university = new Schema({
	title: {
		type: String,
		unique: true
	},
	shortTitle:{
		type: String,
		unique: true
	},
	faculties:[faculty],
	location:{
		city: String,
		street: String,
		building:String
	},
	rating: Number
});

university.statics.getUniversityName = function(id, callback){
	this.findById(id, {shortTitle:1}, function(err, res){
		if(err) return callback(err);
		else{
			if(!res)return callback(null, "Супер универ");
			return callback(null, res.shortTitle);
		}
	})
};

exports.university = connection.model('university', university);
