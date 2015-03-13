var apiServices = (function(w, d, $, pub) {

  var api, conf, defaults, init, xhr;

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
        return fn(null, data)
      } else {
        return fn($.extend({}, data, {status: status}), null);
      }
    };

    promise = $.ajax(req);

    if (typeof fn == 'function') {
      promise.done(callback).fail(callback);
    } else {
      return promise;
    }
    return false;
  };

  pub.getBlogs = function(req, fn) {
    var id = (req.id ? req.id : null);
    var request = {
      url: conf.baseUrl + '/blogs' + (id ? '/' + id : ''),
      method: 'get'
    };
    xhr(request, fn);
  };

  pub.postBlog = function(req, fn) {
    var request = {
      url: '/blogs',
      method: 'post',
      data: req
    };
    xhr(request, fn);
  };

  return api;

})(window,document,jQuery,{});