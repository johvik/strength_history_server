var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var async = require('async');
var mongo = require('./mongo');

var Exercise = require('./exercise').Model;
var SyncTable = require('./synctable').Model;
var Weight = require('./weight').Model;
var Workout = require('./workout').Model;
var WorkoutData = require('./workoutdata').Model;

var User;
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [

      function(val) {
        return (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(val);
      },
      'Invalid email'
    ]
  },
  password: {
    type: String,
    required: true,
    validate: [

      function(val) {
        var len = val.length;
        return len >= 7 && len <= 1024;
      },
      'Password has wrong length'
    ]
  },
  activation: {
    type: String
  }
}, {
  collection: 'user'
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

userSchema.statics.erase = function(email, cb) {
  User.findOne({
    email: email
  }, function(err, doc) {
    if (err !== null || doc === null) {
      return cb(err, null);
    }
    var userid = doc._id;
    // Remove all data linked to the user
    async.parallel([

      function(callback) {
        User.remove({
          _id: userid
        }, callback);
      },
      function(callback) {
        Exercise.remove({
          user: userid
        }, callback);
      },
      function(callback) {
        SyncTable.remove({
          user: userid
        }, callback);
      },
      function(callback) {
        Weight.remove({
          user: userid
        }, callback);
      },
      function(callback) {
        Workout.remove({
          user: userid
        }, callback);
      },
      function(callback) {
        WorkoutData.remove({
          user: userid
        }, callback);
      }
    ], cb);
  });
};

User = mongoose.model('user', userSchema);

exports.Model = User;
