var nodemailer = require('nodemailer');
var config = require('../config');

var smtpTransport = nodemailer.createTransport('SMTP', {
  auth : {
    user : config.EMAIL_ACCOUNT,
    pass : config.EMAIL_PASSWORD
  }
});

exports.sendActivation = function(email, key, callback) {
  var link = config.SERVER_ADDRESS;
  var activation_link = link + '/activate?email=' + email + '&key=' + key;
  var mailOptions = {
    from : 'Strength History <' + config.EMAIL_ACCOUNT + '>',
    to : email,
    subject : 'Strength History account activation',
    generateTextFromHTML : true,
    html : '<h1>Welcome to Strength History!</h1><p>Please visit <a href="' + activation_link + '">this link</a> to activate your account.</p><p>This email address has been used to register an account on <a href="' + link + '">Strength History</a>. If you did not do this, you can ignore this email.</p>'
  };
  if ('test' === process.env.NODE_ENV) {
    // Don't send email while testing
    callback(null, 'test');
  } else {
    smtpTransport.sendMail(mailOptions, callback);
  }
};
