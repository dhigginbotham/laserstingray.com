var helperUtils = (function(w,d,$,pub) {
  /**
   * Helpers utilities, try to keep the general
   * use functions to a minimum, most likely
   * to be replaced with mout or lodash
   */
  
  pub.get = function(prop, obj) {
    var parts, last;
    parts = prop.split('.');
    last = parts.pop();
    while (prop = parts.shift()) {
      obj = obj[prop];
      if (typeof obj !== 'object' || !obj) return;
    }
    return obj[last];
  };

  pub.namespace = function(o, path) {
    if (!path) return o;
    var paths = path.split('.');
    for (var i=0;i<paths.length;++i) {
      var key = paths[i];
      if (!o[key]) {
        o[key] = {};
      }
      o = o[key];
    }
    return o;
  };

  pub.set = function(obj, prop, val) {
    var parts = (/^(.+)\.(.+)$/).exec(prop);
    if (parts){
      pub.namespace(obj, parts[1])[parts[2]] = val;
    } else {
      obj[prop] = val;
    }
  };

  pub.slug = function(str) {
    if (!str) return '';
    return str.toLowerCase()
              .replace(/ /g,'-')
              .replace(/[^\w-]+/g,'');
  }

  return pub;

})(window,document,jQuery, {});