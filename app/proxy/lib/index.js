var request = require('request'),
    _ = require('lodash'),
    bodyParser = require('body-parser');

var Proxy = function(opts, app) {

  if (typeof opts == 'undefined') throw new Error('You must provide a reference to an `options` object');
  if (typeof app == 'undefined') throw new Error('You must provide context to an express `app`');
  
  this.endpoint = '/proxy';
  this.host = null;
  this.preware = [];
  this.headers = {};

  if (opts) _.extend(this, opts);

  if (!(this.preware instanceof Array)) {
    this.preware = [this.preware];
  }
  var buildUri = function(url) {
    var uri = (typeof url != 'undefined' && this.host
      ? this.host + url.replace(this.endpoint,'') 
      : null);
    return (!uri || uri == '/' ? null : uri);
  }.bind(this);

  var setupProxyObject = function(req, res, next) {
    req._proxyObject = _.omit(this,'preware');
    return next();
  }.bind(this);

  var router = function(req, res) {
    var route = {};
    route.url = buildUri(req.url);
    route.headers = this.headers;
    route.method = req.method;
    route.json = true;
    // i guess the second you start being tricky
    // is the same second you want to start docs
    // we're going to inspect the method type, 
    // and then to be on the safe side we'll also
    // enforce your req.body has some stuff in it
    if (route.method.toLowerCase() != 'get' 
      && Object.keys(req.body).length) {
      route.body = req.body;
    }
    if (route.url) {
      request(route, function(err, data) {
        if (err) {
          return res.status(500).json({message: 'oh noes, we\'ve had a critical error .'});
        } else {
          return res.status(data.statusCode).send(data.body);
        }
      });
    } else {
      return res.status(500).json({message: 'You must provide a url to request'});
    }
  }.bind(this);

  app.use(this.endpoint, bodyParser.json(), setupProxyObject, this.preware, router);

  return this;

};

module.exports = Proxy;