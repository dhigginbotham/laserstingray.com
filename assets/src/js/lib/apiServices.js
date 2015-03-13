var apiServices = (function(w, d, $, pub) {

  var api, conf, crud, init, methods, xhr;

  api = function(cfg) {
    if (cfg) $.extend(conf, cfg);
    return pub;
  };

  methods = ['get', 'post', 'put', 'delete'];

  conf = {
    baseUrl: '/api',
    auth: false // should be an object if used
  };

  crud = function(method) {
    return function(collection, req, fn) {
      var id = (req.id ? req.id : null);
      if (id) delete req.id;
      var request = {
        url: '/' + collection + (id ? '/' + id : ''),
        method: method,
        data: req
      };
      return xhr(request, fn);
    };
  };

  init = function() {
    var processor, processing = false;
    processor = function(next) {
      pub[next] = crud('method');
      if (methods.length) {
        return init();
      }
    };
    if (!processing) {
      processing = true;
      var method = methods.shift();
      processor(method);
    }
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

  init();

  return api;

})(window,document,jQuery,{});