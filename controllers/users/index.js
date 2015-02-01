var express = require('express');
var app = module.exports = express();
var config = require('../../config');

app.set('views', config.views);
app.set('view engine', 'jade');

var prefix = '/users';
var id = '/:id?';

var middleware = require('../../db/user/middleware');

app.use(prefix, function(req, res, next) {
  if (req.canPlayRoleOf('user')) {
    return next();
  } else {
    req.session.messages = 'You must be signed in to visit this page';
    return res.redirect('back');
  }
});

app.get(prefix, middleware.findAll, function(req, res) {
  res.render('users/index');
});

app.get(prefix + id, function(req, res) {
  res.render('users/user');
});

app.get(prefix + '/me', function(req, res) {
  res.render('users/user');
});