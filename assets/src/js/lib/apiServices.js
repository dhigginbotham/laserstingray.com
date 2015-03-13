var apiServices = (function(w, d, $, pub) {

  var api, conf, xhr;

  api = function(cfg) {
    if (cfg) $.extend(conf, cfg);
    return pub;
  };

  conf = {
    baseUrl: '/api',
    auth: false // should be an object if used
  };

  // internal xhr wrapper for jq
  xhr = function(req, opts, fn) {
    var callback, promise, options;
    
    options = {
      cacheBusting: false,
      localStorage: false
    };

    if (typeof opts == 'function' && typeof fn == 'undefined') {
      fn = opts;
      opts = null;
    }

    if (opts) $.extend(options, opts);

    callback = function(data, status) {
      if (status == 'success') {
        return fn(null, data);
      } else {
        return fn($.extend({}, data, {status: status}), null);
      }
    };

    // add baseUrl to api request
    req.url = conf.baseUrl + req.url;

    promise = $.ajax(req);

    if (typeof fn == 'function') {
      return promise.done(callback).fail(callback);
    }

    return promise;
  };

  pub.get = function(collection, req, fn) {
    var id = (req.id ? req.id : null);
    var request = {
      url: '/' + collection + (id ? '/' + id : ''),
      method: 'get'
    };
    return xhr(request, fn);
  };

  pub.post = function(collection, req, fn) {
    var request = {
      url: '/' + collection,
      method: 'post',
      data: req
    };
    return xhr(request, fn);
  };

  return api;

})(window,document,jQuery,{});