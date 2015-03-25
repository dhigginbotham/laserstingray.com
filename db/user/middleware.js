var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./');

console.log(typeof ObjectId);

function defCallback(next, res) {
  return function(err, data) {
    if (err) return next(err);
    res.locals.collection = data;
    return next();
  };
}

function findAll(req, res, next) {
  User.find({}, null, {sort: {created_date: -1}}, defCallback(next, res));
}

function find(req, res, next) {
  var query = (req.params.id ? {_id: req.params.id} : {});
  User.findOne(query, null, {sort: {created_date: -1}}, defCallback(next, res));
}

module.exports = {
  findAll: findAll,
  find: find
};