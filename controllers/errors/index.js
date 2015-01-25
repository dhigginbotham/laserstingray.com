var express = require('express');
var app = module.exports = express();
var config = require('../../config');

app.set('views', config.views);
app.set('view engine', 'jade');

var prefix = '/admin';
var id = '/:id?';

app.get('*', function(req, res) {
  res.render('errors/404');
});