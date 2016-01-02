var db = require('../db');
var Schema = require('mongoose').Schema;
var ObjectId = require('mongoose').ObjectId;

var config = require('../config');

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


BlogSchema.statics.middleware = {
  findAll: function _findAll(req, res, next) {
    Blog.find({}, null, {sort: {created_date: -1}}, function(err, data) {
      if (err) return next(err);
      res.locals.blog = data;
      return next();
    });
  },
  find: function find(req, res, next) {
    var query = (req.params.id ? {_id: req.params.id} : {});
    if (query._id) {
      Blog.findOne(query, null, {sort: {created_date: -1}}, function(err, data) {
        if (err) return next(err);
        res.locals.blog = data;
        return next();
      });
    } else {
      return next();
    }
  }
};



//
//db seed for user
//

var blog = require('../db/seed/blog');