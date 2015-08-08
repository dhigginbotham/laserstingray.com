/**
 * proxy controller for express, utilizes
 * mongodb cache things
 */
var request = require('request'),
    lo = require('lodash'),
    bodyParser = require('body-parser');

var napip = function(opts, done) {

  // private operations fns, declared here
  // to avoid any confusion as to their
  // purposes
  var xhr, 
      transformer, 
      router;

  this.prefix = '/proxy';

  // base url for a proxy endpoint, be as complete
  // or generic as you want, but remember -- this is
  // a pretty powerful proxy layer without basic 
  // security in place you can leave someone elses
  // APIs wide open, or worse -- authenticated with
  // your credentials.
  this.proxyUrl = null;

  // supports methods, sometimes(usually?) you'll
  // want a bit extra control over a proxy layer
  // as transparent as this.
  this.supports = ['delete','get', 'post', 'put'];

  // an important note would be that I (@dhigginbotham) want
  // support for stale,expired data on a prefetch 
  // and onstale strategy for my use cases so I'll 
  // be writing this mostly supporting those strategies

  // following express concept of middleware
  // this will allow you to have control over
  // before and after proxied request.
  this.transformers = {
    pre: [],
    after: []
  };

  if (typeof opts != 'undefined') {
    lo.extend(this, opts);
  }

  var self = this;

  /**
   * internal request handler
   * @param  {Object}   opts [description]
   * @param  {Function} fn   [description]
   */
  xhr = function(opts, fn) {

  };

  router = function(req, res, next) {
    var method = req.method.toLowerCase();
  };

  return this;

};