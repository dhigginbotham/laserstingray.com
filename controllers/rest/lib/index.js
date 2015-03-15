var _ = require('lodash');
var bodyParser = require('body-parser');

function Rest(opts, app) {

  //public options
  this.prefix = '/api';
  this.path = null;
  this.key = 'collection';
  this.preware = [];
  this.afterware = [];
  this.validate = [];
  this.model = null;

  // extend options
  if (opts) _.extend(this, opts);

  this.supports = ['post', 'put', 'get', 'delete'];

  // make your collection paths plural, probably not something
  // i should be strictly enforcing for you :(
  if (!this.path) {
    this.path = '/' + this.model.modelName.toLowerCase();
    if (this.path[this.path.length-1] != 's') this.path += 's';
  }

  // maintain context
  var self = this;

  // internal router mechanism to determine which request
  // to handle
  this.router = function router(req, res, next) {
    var method = req.method.toLowerCase();
    if (self.supports.indexOf(method) == -1) {
      return next(JSON.stringify({
        error: 'This HTTP Method is unsuported'
      }), null);
    }

    function defaultCallback(err, resp) {
      if (err) return next(err, null);
      req[self.key] = resp;
      return next();
    };

    return self[method](req, defaultCallback);

  };

  // endpoint for json responses
  this.endpoint = function endpoint(req, res) {
    return res.json(req[self.key]);
  };

  // autowire subapp by passing app var
  if (app) {
    return this.mount(app);
  } else {
    return this;
  }

};

/**
 * creates a new document
 * @param  {Object}   req request object supplied by express
 * @param  {Function} fn  callback function
 */
Rest.prototype.createDocument = function(req, fn) {
  var newCollection = new this.model(req.body);
  newCollection.save(fn);
};

/**
 * updates any given object
 * @param  {Object}   req request object supplied by express
 * @param  {Function} fn  callback function
 */
Rest.prototype.updateDocument = function(req, fn) {
  var id = (req.params.id ? {_id: req.params.id} : null);
  var update = _.omit(req.body, '_id');
  this.model.update(id, update, {upsert: true}, fn);
};

/**
 * mount application to express
 * @param  {Object} app express application object
 */
Rest.prototype.mount = function(app) {
  var url = this.prefix + this.path + '/:id?';
  app.use(url, bodyParser.json(), this.validate, this.preware, this.router, this.afterware, this.endpoint);
  return this;
};

/**
 * get method
 * @param  {Object}   req request object supplied by express
 * @param  {Function} fn  callback function
 */
Rest.prototype.get = function(req, fn) {
  var id = (req.params.id ? {_id: req.params.id} : {});
  this.model.find(id, fn);
};

/**
 * post method
 * @param  {Object}   req request object supplied by express
 * @param  {Function} fn  callback function
 */
Rest.prototype.post = function(req, fn) {
  if (req.params.id) {
    this.updateDocument(req, fn);
  } else {
    this.createDocument(req, fn);
  }
};

/**
 * put method
 * @param  {Object}   req request object supplied by express
 * @param  {Function} fn  callback function
 */
Rest.prototype.put = function(req, fn) {
  if (req.params.id) {
    this.updateDocument(req, fn);
  } else {
    return fn(null, {
      error: 'A valid id is required for this type of request'
    });
  }
};

/**
 * delete method
 * @param  {Object}   req request object supplied by express
 * @param  {Function} fn  callback function
 */
Rest.prototype.delete = function(req, fn) {
  var id = (req.params.id ? {_id: req.params.id} : null);
  this.model.remove(id, fn);
};

if (typeof module != 'undefined' && module.exports) {
  module.exports = Rest;
}