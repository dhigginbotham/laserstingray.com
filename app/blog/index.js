var express = require('express');
var app = module.exports = express();
var config = require('../config');
var marked = require('marked');
var moment = require('moment');

var middle = require('./middle');

app.set('views', config.views);
app.set('view engine', 'jade');

var prefix = '/blog';
var id = '/:id?';

app.use(prefix, function(req, res, next) {
  res.locals.marked = marked;
  res.locals.moment = moment;
  return next();
});

app.get(prefix, middle.findAll, function(req, res) {
  res.render('blog/archive');
});

app.get(prefix + id, middle.find, function(req, res) {
  res.render('blog/single');
});