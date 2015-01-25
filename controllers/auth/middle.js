var multiparty = require('multiparty');
var middle = {};

middle.formdata = function(req, res, next) {
  var form = new multiparty.Form();
  var body = {};

  form.on('error', next);
  
  form.on('close', function() {
    req.body = res.locals.body = body;
    next();
  });

  form.on('field', function(key, val) {
    body[key] = val;
  });

  form.parse(req);
};


module.exports = middle;