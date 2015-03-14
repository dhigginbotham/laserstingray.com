var express = require('express');
var app = module.exports = express();
var config = require('../../config');
var marked = require('marked');
var moment = require('moment');

var middle = require('./middle');

app.set('views', config.views);
app.set('view engine', 'jade');

var prefix = '/admin';
var id = '/:id?';

app.use(prefix, function(req, res, next) {
  if (req.canPlayRoleOf('admin')) {
    res.locals.adminSection = true;
    res.locals.marked = marked;
    res.locals.moment = moment;
    return next();
  } else {
    res.redirect('back');
  }
});

app.get(prefix, middle.getBlogCount, middle.getUserCount, function(req, res, next) {
  res.render('admin/dashboard');
});

app.get(prefix + '/blog' + id, function(req, res, next) {
  res.render('admin/save');
});