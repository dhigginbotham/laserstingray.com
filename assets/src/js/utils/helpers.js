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

  var namespace = function(obj, path) {
    if (!path) return obj;
    var paths = path.split('.');
    for (var i=0;i<paths.length;++i) {
      var key = paths[i];
      if (!obj[key]) {
        obj[key] = {};
      }
      obj = obj[key];
    }
    return obj;
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

  var data = pub.data = function(elem, key, val) {
    if (!elem) return {};
    var attrs, data = {};
    attrs = elem.attributes;
    for (var i=0;i<attrs.length;++i) {
      var k;
      if (attrs[i].name.indexOf('data-') === 0) {
        k = attrs[i].name.substr(5, attrs[i].name.length-5);
        if (key == k && typeof val == 'undefined') return attrs[i].value;
        if (key == k && typeof val != 'undefined') attrs[i].value = val;
        data[k] = attrs[i].value;
      }
    }
    if (!data.hasOwnProperty(key) && typeof val != 'undefined') {
      data[key] = val;
      elem.setAttribute(key, val);
    }
    return data;
  };

  var properCaseStr = pub.properCaseStr = function(str) {
    if (!str) return false;
    if (str.length == 1) return str.toUpperCase();
    var proper, sub;
    sub = str.substr(1,str.length);
    proper = str[0].toUpperCase() + sub;
    return proper;
  };

  return pub;

})(window,document,jQuery, {});