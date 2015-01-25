var config = require('../../config');
var User = require('../user');
var db = require('../');

if (config.seed.admin) {
  db.once('open', function() {
    User.findOne({username: 'admin'}, function(err, seed) {
      if (err) throw new Error(err);
      if (!seed) {
        var admin = new User({
          username: 'admin',
          password: process.env.NODE_PASS || 'if_you_need_to_use_this_in_prod_set_env_var',
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