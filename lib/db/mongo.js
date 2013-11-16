var mongoose = require('mongoose');
var config = require('../../config/config.js');

mongoose.connect(config.MONGODB, function(err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + config.MONGODB + '. ' + err);
  } else {
    console.log('Successfully connected db');
  }
});
