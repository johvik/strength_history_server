var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./db/user').Model;

var failMessage = 'Invalid email or password.';
var notActivatedMessage = 'Account not activated.';

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function(email, password, done) {
  User.findOne({
    email: email
  }, function(err1, user) {
    if (err1) {
      return done(err1);
    }
    if (!user) {
      return done(null, false, {
        message: failMessage
      });
    }
    user.comparePassword(password, function(err2, isMatch) {
      if (err2) {
        return done(err2);
      }
      if (isMatch) {
        if (user.activation !== 'done') {
          return done(null, false, {
            message: notActivatedMessage
          });
        }
        return done(null, user);
      }
      return done(null, false, {
        message: failMessage
      });
    });
  });
}));

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send(401);
};
