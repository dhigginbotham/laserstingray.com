var path = require('path');

//
// App shared configs
//

var config = {
  title: 'LaserStingray',
  appName: 'LaserStingray',
  port: 3000,
  sessionId: 'lsid',
  views: path.join(__dirname, '..', 'views'),
  public: path.join(__dirname, '..', 'assets', 'build'),
  secret: 'do_not_use_in_production!!',
  db: 'mongodb://127.0.0.1:27017/laserStingray',
  env: process.env.NODE_ENV || 'development'
};

//
// Global variables for templates
//

var date = new Date();

config.templateVariables = {
  title: config.title,
  appName: config.appName,
  copyrightDate: date.getFullYear()
};

//
// Data seeds for demoing, and easier initial wiring
//

config.seed = {
  admin: true,
  blog: true
};

module.exports = config;