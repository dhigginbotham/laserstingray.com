var express = require('express');
var app = module.exports = express();

var Rest = require('./lib');
var Validate = require('./lib/validate');
var Blog = require('app/blog/model');
var User = require('app/users/model');

//
//generic rest handler for application paths (using here, because we're not going to need authkeys)
//

function stateAuthentication(req, res, next) {
  if (req.canPlayRoleOf('apiUser')) {
    return next();
  } else {
    return res.status(401).json({'error': 'user not authorized for this type of role', 'status': 401});
  }
}

function validateBlogPosts(req, res, next) {
  var requiredKeys = [{
    key: 'title',
    minlength: 3
  },{
    key: 'body',
    minlength: 20
  }];
  Validate(requiredKeys, req.body, function(err, success) {
    if (err) return res.status(400).json(err);
    if (success) req.validatedRequest = success;
    return next();
  });
}

var blog = new Rest({
  model: Blog,
  validate: validateBlogPosts,
  preware: stateAuthentication
}, app);

var user = new Rest({
  model: User,
  preware: stateAuthentication
}, app);
