var apiServices = (function(w, d, $, pub) {

  var conf, crud, init, xhr;

  conf = {
    auth: false, // should be an object if used
    baseUrl: '/api',
    exposeXhr: true,
    methods: ['get', 'post', 'put', 'delete']
  };

  crud = function(method) {
    return function(collection, req, opts, fn) {
      if (typeof opts === 'function' && typeof fn === 'undefined') {
        fn = opts;
        opts = null;
      }
      var id = (req.id ? req.id : null);
      if ((method === 'put' || method === 'delete') && !id) {
        return fn({fatal: 'Expected an id for method type: ' + method}, null);
      }
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
    var copy = Array.prototype.slice.call(conf.methods);
    var processor = function() {
      var cur = copy.shift();
      pub[cur] = crud(cur);
      if (copy.length) processor();
    };
    processor();
    return fn;
  };

  // internal xhr wrapper for jq
  xhr = function(req, opts, fn) {
    var callback, promise, operator, options;

    if (typeof req === 'undefined') return false;

    if (typeof opts === 'function' && typeof fn === 'undefined') {
      fn = opts;
      opts = null;
    }

    callback = function(data, status) {
      if (status == 'success') {
        return fn(null, data);
      } else {
        return fn({error: data.responseText, status: data.status}, null);
      }
    };

    operator = (!!~req.url.indexOf('?') ? '&' : '?');
    options = {
      cacheBusting: false, // if not boolean, expects string to append parameter
      localStorage: false
    };

    if (opts) $.extend(options, opts);

    // add baseUrl to api request uri
    req.url = conf.baseUrl + req.url;

    // add cacheBusting to api request uri
    if (options.cacheBusting) {
      req.url += operator + options.cacheBusting + '=' + new Date().getTime();
    }

    promise = $.ajax(req);

    if (typeof fn === 'function') {
      return promise.done(callback).fail(callback);
    }

    return promise;
  };

  pub.cfg = function() {
    return conf;
  };

  return init(function(cfg) {
    if (cfg) $.extend(conf, cfg);
    if (conf.exposeXhr) pub.xhr = xhr;
    return pub;
  });

})(window,document,jQuery,{});