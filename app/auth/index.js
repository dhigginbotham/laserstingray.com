var express = require('express');
var app = module.exports = express();
var config = require('../../config');
var passport = require('passport');
var local = require('../passport');

app.set('views', config.views);
app.set('view engine', 'jade');

var prefix = '/auth';
var id = '/:id?';

app.get(prefix, function(req, res) {
  res.render('auth/login');
});

app.post(prefix, local.postLogin, function(req, res) {
  res.redirect('/');
});

app.get(prefix + '/logout', local.logout);