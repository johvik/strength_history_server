var passport = require('passport');

exports.getCheckLogin = function(req, res) {
  res.contentType('application/javascript');
  if (req.isAuthenticated()) {
    return res.send('var CheckLogin = true;');
  }
  return res.send('var CheckLogin = false;');
};

exports.postLogin = function(req, res, next) {
  passport.authenticate('local', function(err1, user, info) {
    if (err1) {
      return next(err1);
    }
    if (!user) {
      req.session.message = info.message;
      return res.send(400);
    }
    req.logIn(user, function(err2) {
      if (err2) {
        return next(err2);
      }
      return res.send(200);
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.send(200);
};
