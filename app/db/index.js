var mongoose = require('mongoose');
var config   = require('app/config');

if (config.env == 'development') {
  mongoose.set('debug', true);
}

var conn = config.db;
var db = module.exports = mongoose.createConnection(conn);

// process.on('SIGINT', function() {
//   db.close();
// });