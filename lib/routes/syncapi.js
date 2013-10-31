var SyncTable = require('../db/synctable').Model;
var util = require('./util');

exports.get = util.get(SyncTable);
