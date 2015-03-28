var helperUtils = (function(w,d,$,pub) {
  /**
   * Helpers utilities, try to keep the general
   * use functions to a minimum, most likely
   * to be replaced with mout or lodash
   */
  
  var get = pub.get = function(prop, obj) {
    var parts, last;
    parts = prop.split('.');
    last = parts.pop();
    while (prop = parts.shift()) {
      obj = obj[prop];
      if (typeof obj !== 'object' || !obj) return;
    }
    return obj[last];
  };

  var namespace = function(o, path) {
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

  var set = pub.set = function(obj, prop, val) {
    var parts = (/^(.+)\.(.+)$/).exec(prop);
    if (parts){
      namespace(obj, parts[1])[parts[2]] = val;
    } else {
      obj[prop] = val;
    }
  };

  var slug = pub.slug = function(str) {
    if (!str) return '';
    return str.toLowerCase()
              .replace(/ /g,'-')
              .replace(/[^\w-]+/g,'');
  };

  var data = pub.data = function (elem) {
    if (!elem) return {};
    var d = {};
    for (var i = 0; i < elem.attributes.length; ++i) {
      var clean, dirty, key, val, arr;
      if (elem.attributes[i] == '[object Attr]') {
        clean = [];
        key = (elem.attributes[i].name ? elem.attributes[i].name : null);
        val = (elem.attributes[i].value ? elem.attributes[i].value : null);
        arr = key.match(/data-(.*)/gi);
        if (arr instanceof Array) {
          dirty = arr[0].replace('data-', '')
              .split('-');
          for (var j = 0; j < dirty.length; ++j) {
            var parsed = (j < 1 ? dirty[j] : properCaseStr(dirty[j]));
            clean.push(parsed);
          }
          clean = clean.join('');
          d[clean] = val;
        }
      }
    }
    return d;
  };

  var properCaseStr = pub.properCaseStr = function(str) {
    if (!str) return false;
    if (str.length == 1) return str.toUpperCase();
    var proper, sub;
    sub = str.substr(1,str.length);
    proper = str[0].toUpperCase() + sub;
    return proper;
  }

  return pub;

})(window,document,jQuery, {});