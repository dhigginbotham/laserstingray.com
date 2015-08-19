var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('app/users/model');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    username = username.trim();
    var userRegex = new RegExp(username, 'i');

    User.findOne({username: userRegex}, function(err, user) {
      if (err) return done(new Error(err));
      if (!user) return done(null, false, {message: 'bad username/password combo'});

      user.comparePassword(password, function(err, matched) {
        if (err) return done(new Error(err));
        if (matched) {
          user.last_login.push(Date.now());
          user.save(function(err) {
            if (err) return done(new Error(err));
            return done(null, user, {message: 'welcome back ' + user.username});
          });
        } else {
          return done(null, false, {message: 'bad username/password combo'});
        }
      });
    });
  }
));

exports.postLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages = [info.message];
      return res.redirect('/auth')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.session.messages = [info.message];
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};