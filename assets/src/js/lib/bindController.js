var bindController = (function(w,d,$,pub) {
  
  var model, ready, state;
  var api, bindElements, collectState, dots, init;

  model = {};
  pub.binding = false;
  ready = false;
  state = [];

  api = function(context) {
    if (typeof context == 'object') $.extend(model, context);
    bindElements();
    return pub;
  };

  pub.bindElements = bindElements = function(key) {
    if (ready) {
      pub.binding = false;
      for (var i=0;i<state.length;++i) {
        var count, elem, val, k;
        elem = state[i];
        k = (key ? key : elem.getAttribute('data-bind'));
        val = (!~k.indexOf('.') ? model[k] : dotLookup(k, model));
        if (k == elem.getAttribute('data-bind') && typeof val != 'undefined') {
          if (!elem.getAttribute('data-bound')) elem.setAttribute('data-bound', true);
          if (elem.getAttribute('data-bind-first') === null) {
            elem.setAttribute('data-bind-first', encodeURIComponent(val));
          }
          count = elem.getAttribute('data-bind-count');
          if (count === null) {
            elem.setAttribute('data-bind-count', 1);
          } else {
            elem.setAttribute('data-bind-count', count+1);
          }
          elem.innerHTML = val;
        } else {
          continue;
        }
      }
    }
    return pub;
  };

  pub.update = collectState = function(context, fn) {
    pub.binding = true;
    var ctx, dom;
    if (typeof context == 'function' && 
        typeof fn == 'undefined') {
      fn = context;
      context = null;
    }
    ctx = (context ? context : d);
    dom = ctx.getElementsByTagName('*');
    for (var i=0;i<dom.length;++i) {
      var key, val;
      if (dom[i].getAttribute('data-bound') === null) {
        key = dom[i].getAttribute('data-bind');
        if (key !== null) {
          val = (dom[i].innerHTML ? 
                  dom[i].innerHTML : 
                  dom[i].getAttribute('data-bind-first'));
          if (!~key.indexOf('.')) {
            model[key] = (val && !model[key] ? val : null);
          }
          state.push(dom[i]);
        } else {
          continue;
        }
      }
    }
    if (typeof fn != 'undefined') fn();
    return pub;
  };

  pub.orig = function(key) {
    if (typeof key != 'undefined') {
      for (var i=0;i<state.length;++i) {
        var elem = state[i];
        if (elem.getAttribute('data-bind') == key && 
            elem.getAttribute('data-bind-first') !== null) {
          pub.set(key, decodeURIComponent(elem.getAttribute('data-bind-first')));
        }
      }
    }
  };

  pub.set = function(key, val, all) {
    model[key] = val;
    if (all) key = null;
    bindElements(key);
    return pub;
  };

  init = function() {
    if (!ready) ready = true;
    bindElements();
    pub.model = model;
    pub.state = state;
  };

  collectState(function() {
    $(d).ready(init);
  });

  return api;

})(window,document,jQuery,{});