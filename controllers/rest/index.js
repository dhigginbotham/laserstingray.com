var express = require('express');
var app = module.exports = express();

var Rest = require('./lib');
var Blog = require('../../db/blog');

var options = {
  model: Blog
};

var blog = new Rest(options, app);