var db = require('../');
var Schema = require('mongoose').Schema;
var ObjectId = require('mongoose').ObjectId;

var config = require('../../config');

var BlogSchema = new Schema({
  title: String,
  body: String,
  author: String,
  created_date: { type: Date, default: Date.now },
  updated_date: [{ type: Date, default: Date.now }],
  is_editing: {type: Boolean, default: false}
});

var Blog = module.exports = db.model('Blog', BlogSchema);

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