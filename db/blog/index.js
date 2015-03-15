var db = require('../');
var Schema = require('mongoose').Schema;
var ObjectId = require('mongoose').ObjectId;

var config = require('../../config');

var BlogSchema = new Schema({
  author: String,
  body: String,
  created_date: { type: Date, default: Date.now },
  excerpt: String,
  is_editing: {type: Boolean, default: false},
  published: {type: Boolean, default: false},
  slug: String,
  tags: [{ type: String }],
  title: String,
  updated_date: [{ type: Date, default: Date.now }],
});

var Blog = module.exports = db.model('Blog', BlogSchema);

//
//db seed for user
//

var blog = require('../seed/blog');