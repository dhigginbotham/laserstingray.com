var config = require('../../config');
var Blog = require('../blog');
var db = require('../');

if (config.seed.blog) {
  db.once('open', function() {
    Blog.findOne({title: 'First Test Blog Post'}, function(err, seed) {
      if (err) throw new Error(err);
      if (!seed) {
        var blog = new Blog({
          title: 'First Test Blog Post',
          body: '*First Test Blog Post!!*'
        });

        blog.save(function(err) {
          if (err) throw new Error(err);
        });
      } else {
        console.log('blog post already exists, you can turn this off in the config settings');
      }
    });
  });
}