var Blog = require('./');

function findAll(req, res, next) {
  Blog.find({}, null, {sort: {created_date: -1}}, function(err, data) {
    if (err) return next(err);
    res.locals.blog = data;
    return next();
  });
}

function find(req, res, next) {
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

module.exports = {
  findAll: findAll,
  find: find
};