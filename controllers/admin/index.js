var express = require('express');
var app = module.exports = express();
var config = require('../../config');
var marked = require('marked');
var moment = require('moment');

app.set('views', config.views);
app.set('view engine', 'jade');

var prefix = '/admin';
var id = '/:id?';

app.use(prefix, function(req, res, next) {
  res.locals.marked = marked;
  res.locals.moment = moment;
  return next();
});

app.get(prefix, function(req, res, next) {
  if (req.canPlayRoleOf('admin')) {
    res.render('admin/dashboard');
  } else {
    res.redirect('/');    
  }
});