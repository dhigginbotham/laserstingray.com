var Blog = require('../../db/blog');
var User = require('../../db/user');
var middle = {};

middle.getBlogCount = function(req, res, next) {
  Blog.find({}, function(err, data) {
    if (err) return next(err);
    res.locals.blogCount = data.length;
    next();
  });
};

middle.getUserCount = function(req, res, next) {
  User.find({}, function(err, data) {
    if (err) return next(err);
    res.locals.userCount = data.length;
    next();
  });
};

module.exports = middle;