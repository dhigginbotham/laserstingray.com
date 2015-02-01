var User = require('./');

function findAll(req, res, next) {
  User.find({}, null, {sort: {created_date: -1}}, function(err, data) {
    if (err) return next(err);
    res.locals.users = data;
    return next();
  });
}

function find(req, res, next) {
  var query = (req.params.id ? {_id: req.params.id} : {});
  User.findOne(query, null, {sort: {created_date: -1}}, function(err, data) {
    if (err) return next(err);
    res.locals.user = data;
    return next();
  });
}

module.exports = {
  findAll: findAll,
  find: find
};