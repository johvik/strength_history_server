var mongoose = require('mongoose');
var config = require('../../config/config.js');

mongoose.connect(config.MONGODB, function(err, res) {
  if (err) {
    throw err;
  } else {
    console.log('Successfully connected db');
  }
});
