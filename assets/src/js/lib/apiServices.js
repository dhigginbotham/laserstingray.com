var apiServices = (function(w, d, $, pub) {

  var conf, crud, init, methods, xhr;

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
      return (typeof fn != 'undefined' ? xhr(request, fn) : xhr(request));
    };
  };

  init = function(fn) {
    var processor = function() {
      pub[methods.shift()] = crud('method');
      if (methods.length) return processor();
    };
    processor();
    return fn;
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

  return init(function(cfg) {
    if (cfg) $.extend(conf, cfg);
    return pub;
  });

})(window,document,jQuery,{});