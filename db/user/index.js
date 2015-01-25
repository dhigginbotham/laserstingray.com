var db = require('../');
var Schema = require('mongoose').Schema;
var ObjectId = require('mongoose').ObjectId;

var config = require('../../config');

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

var User = module.exports = db.model('User', UserSchema);

if (config.seed.admin) {
  db.once('open', function() {
    User.findOne({username: 'admin'}, function(err, seed) {
      if (err) throw new Error(err);
      if (!seed) {
        var admin = new User({
          username: 'admin',
          password: process.env.NODE_PASS,
          email: 'admin@localhost.it',
          role: 10
        });

        admin.save(function(err) {
          if (err) throw new Error(err);
        });
      } else {
        console.log('seed user already exists, you can turn this off in the config settings');
      }
    });
  });
}