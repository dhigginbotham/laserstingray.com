var db = require('../');
var Schema = require('mongoose').Schema;
var ObjectId = require('mongoose').ObjectId;

var config = require('../../config');

var BlogSchema = new Schema({
  title: String,
  body: String,
  author: String,
  created_date: { type: Date, default: Date.now },
  updated_date: [{ type: Date, default: Date.now }],
  is_editing: {type: Boolean, default: false}
});

var Blog = module.exports = db.model('Blog', BlogSchema);

//
//db seed for user
//

var blog = require('../seed/blog');