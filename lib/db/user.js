var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var async = require('async');
var mongo = require('./mongo');

var userSchema = new mongoose.Schema({
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
}, {
	collection : 'user'
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

exports.Model = userModel;
