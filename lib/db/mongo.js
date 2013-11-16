var mongoose = require('mongoose');
var config = require('../../config/config.js');

if (process.env.VCAP_SERVICES) {
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-1.8'][0].credentials;
} else {
  var mongo = config.MONGODB;
}
var generate_mongo_url = function(obj) {
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');
  if (obj.username && obj.password) {
    return 'mongodb://' + obj.username + ':' + obj.password + '@' + obj.hostname + ':' + obj.port + '/' + obj.db;
  }
  return 'mongodb://' + obj.hostname + ':' + obj.port + '/' + obj.db;
};

var mongourl = generate_mongo_url(mongo);

mongoose.connect(mongourl, function(err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + mongourl + '. ' + err);
  } else {
    console.log('Successfully connected db');
  }
});
