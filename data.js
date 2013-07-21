if (process.env.VCAP_SERVICES) {
	var env = JSON.parse(process.env.VCAP_SERVICES);
	var mongo = env['mongodb-1.8'][0]['credentials'];
} else {
	var mongo = {
		'hostname' : 'localhost',
		'port' : 27017,
		'username' : '',
		'password' : '',
		'name' : '',
		'db' : 'db'
	};
}
var generate_mongo_url = function(obj) {
	obj.hostname = (obj.hostname || 'localhost');
	obj.port = (obj.port || 27017);
	obj.db = (obj.db || 'test');
	if (obj.username && obj.password) {
		return 'mongodb://' + obj.username + ':' + obj.password + '@'
				+ obj.hostname + ':' + obj.port + '/' + obj.db;
	} else {
		return 'mongodb://' + obj.hostname + ':' + obj.port + '/' + obj.db;
	}
};
var mongourl = generate_mongo_url(mongo);

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var async = require('async');

mongoose.connect(mongourl, function(err, res) {
	if (err) {
		console.log('ERROR connecting to: ' + mongourl + '. ' + err);
	} else {
		console.log('Successfully connected to: ' + mongourl);
	}
});

var Schema = mongoose.Schema;
var userSchema = new Schema({
	username : {
		type : String,
		required : true,
		unique : true
	},
	email : {
		type : String,
		required : true,
		unique : true
	},
	password : {
		type : String,
		required : true
	}
});

userSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.genSalt(function(err, salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};
var userModel = mongoose.model('user', userSchema);
// TODO Remove test user
var testUser = new userModel({
	username : 'test',
	email : 'test',
	password : 'test'
});

testUser.save();

module.exports = {
	userModel : userModel
};
