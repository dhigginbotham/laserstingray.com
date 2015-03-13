var apiServices = (function(w, d, $, pub) {

  var conf, crud, init, methods, xhr;

  methods = ['get', 'post', 'put', 'delete'];

  conf = {
    auth: false, // should be an object if used
    baseUrl: '/api',
    exposeXhr: true
  };

  crud = function(method) {
    return function(collection, req, opts, fn) {
      if (typeof opts === 'function' && typeof fn === 'undefined') {
        fn = opts;
        opts = null;
      }
      var id = (req.id ? req.id : null);
      if (id) delete req.id;
      var request = {
        url: '/' + collection + (id ? '/' + id : ''),
        method: method,
        data: req
      };
      return (typeof fn !== 'undefined' ? xhr(request, fn) : xhr(request));
    };
  };

  init = function(fn) {
    var processor = function() {
      var cur = methods.shift();
      pub[cur] = crud(cur);
      if (methods.length) return processor();
    };
    processor();
    return fn;
  };

  // internal xhr wrapper for jq
  xhr = function(req, opts, fn) {
    var callback, promise, operator, options;
    operator = (!!~req.url.indexOf('?') ? '&' : '?');
    options = {
      cacheBusting: false, // if not boolean, expects string to append parameter
      localStorage: false
    };

    if (typeof opts === 'function' && typeof fn === 'undefined') {
      fn = opts;
      opts = null;
    }

    if (opts) $.extend(options, opts);

    callback = function(data, status) {
      if (status == 'success') {
        return fn(null, data);
      } else {
        return fn({msg: data.responseText, status: data.status}, null);
      }
    };

    // add baseUrl to api request
    req.url = conf.baseUrl + req.url + (options.cacheBusting ? operator + options.cacheBusting + '=' + new Date().getTime() : '');

    promise = $.ajax(req);

    if (typeof fn === 'function') {
      return promise.done(callback).fail(callback);
    }

    return promise;
  };

  return init(function(cfg, mixins) {
    if (cfg) $.extend(conf, cfg);
    if (conf.exposeXhr) pub.xhr = xhr;
    return pub;
  });

})(window,document,jQuery,{});