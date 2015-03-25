var User = require('./');

function defCallback(res, next) {
  return function(err, data) {
    if (err) return next(err);
    res.locals.collection = data;
    return next();
  };
}

function findAll(req, res, next) {
  User.find({}, null, {sort: {created_date: -1}}, defCallback(res, next));
}

function find(req, res, next) {
  var query = (req.params.id ? {_id: req.params.id} : {});
  User.findOne(query, null, {sort: {created_date: -1}}, defCallback(res, next));
}

module.exports = {
  findAll: findAll,
  find: find
};