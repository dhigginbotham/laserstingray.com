var express = require('express');
var app = module.exports = express();
var config = require('../config');

app.set('views', config.views);
app.set('view engine', 'jade');

var prefix = '/users';
var id = '/:id?';

var middleware = require('./middle');

function authMiddleware(req, res, next) {
  if (req.canPlayRoleOf('user')) {
    return next();
  } else {
    req.session.messages = 'You must be signed in to visit this page';
    return res.redirect('back');
  }
}

app.use(prefix, authMiddleware);

app.get(prefix, middleware.findAll, function(req, res) {
  res.render('users/index');
});

app.get(prefix + id, middleware.find, function(req, res) {
  res.render('users/user');
});
