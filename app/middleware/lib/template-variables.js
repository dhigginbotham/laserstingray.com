//
// Template Variables Middleware
// -----------------------------
// Use this middleware to set default variables
// like `title`, `app name`, etc
//

var config = require('../../config');

function templateVariables(req, res, next) {
  res.locals.globalVars = config.templateVariables;
  return next();
};

module.exports = templateVariables;