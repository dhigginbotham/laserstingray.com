var db = require('app/db');
var Schema = require('mongoose').Schema;
var ObjectId = require('mongoose').ObjectId;

var config = require('app/config');

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  username: String,
  password: String,
  role: Number,
  updated_date: Date,
  created_date: { type: Date, default: Date.now },
  last_login: [{ type: Date, default: Date.now }],
  ip: String
});

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  } else {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        return next();
      });
    });
  }
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

function defCallback(res, next) {
  return function(err, data) {
    if (err) return next(err);
    res.locals.collection = data;
    return next();
  };
}


var User = module.exports = db.model('User', UserSchema);

UserSchema.statics.middleware = {
  findAll: function findAll(req, res, next) {
    User.find({}, null, {sort: {created_date: -1}}, defCallback(res, next));
  },
  find: function find(req, res, next) {
    var query = (req.params.id ? {_id: req.params.id} : {});
    User.findOne(query, null, {sort: {created_date: -1}}, defCallback(res, next));
  }
};
//
//db seed for user
//

var user = require('app/db/seed/user');