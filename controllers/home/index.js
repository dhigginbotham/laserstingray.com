var express = require('express');
var app = module.exports = express();
var config = require('../../config');

app.set('views', config.views);
app.set('view engine', 'jade');

app.route('/')
    .get(function(req, res) {
      res.render('home/index')
    });