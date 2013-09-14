var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mongo = require('./mongo');

var emailPattern = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');

var userSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
    unique : true,
    validate : [
      function(val) {
        return emailPattern.test(val);
      },
      'Invalid email'
    ]
  },
  password : {
    type : String,
    required : true,
    validate : [
      function(val) {
        var len = val.length;
        return len >= 7 && len <= 1024;
      },
      'Password has wrong length'
    ]
  },
  activation : {
    type : String
  }
}, {
  collection : 'user'
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  crypto.randomBytes(32, function(err1, bytes) {
    if (err1) {
      return next(err1);
    }
    bcrypt.genSalt(function(err2, salt) {
      if (err2) {
        return next(err2);
      }
      bcrypt.hash(user.password, salt, function(err3, hash) {
        if (err3) {
          return next(err3);
        }
        user.password = hash;
        user.activation = bytes.toString('hex');
        next();
      });
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

userSchema.statics.addTest = function() {
  // TODO Remove test user
  new User({
    email : 'te@st',
    password : 'testing'
  }).save();
};

var User = mongoose.model('user', userSchema);
User.addTest();

exports.Model = User;
