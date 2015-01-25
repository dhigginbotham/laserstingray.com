var Blog = require('../../db/blog');

function findAll(req, res, next) {
  Blog.find({}, function(err, data) {
    if (err) return next(err);
    res.locals.blog = data;
    return next();
  });
}

function find(req, res, next) {
  var query = (req.params.id ? {_id: req.params.id} : {});
  Blog.findOne(query, function(err, data) {
    if (err) return next(err);
    console.log(data);
    res.locals.blog = data;
    return next();
  });
}

module.exports = {
  findAll: findAll,
  find: find
};