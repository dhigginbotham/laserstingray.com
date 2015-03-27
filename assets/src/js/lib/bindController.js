var bindController = (function(w,d,$,pub) {
  
  var model, ready, state;
  var api, bindElements, collectState, get, init, set;

  get = helperUtils.get;
  set = helperUtils.set;

  model = {};
  ready = false;
  state = [];

  api = function(context) {
    if (typeof context == 'object') $.extend(model, context);
    bindElements();
    return pub;
  };

  pub.bindElements = bindElements = function(key) {
    if (ready) {
      for (var i=0;i<state.length;++i) {
        var count, elem, val, k;
        elem = state[i];
        k = (key ? key : elem.getAttribute('data-bind'));
        val = (!~k.indexOf('.') ? model[k] : get(k, model));
        if (elem.innerHTML && elem.innerHTML == val) continue;
        if (k == elem.getAttribute('data-bind') && typeof val != 'undefined') {
          if (!elem.getAttribute('data-bound')) elem.setAttribute('data-bound', true);
          if (val && elem.getAttribute('data-bind-first') === null) elem.setAttribute('data-bind-first', encodeURIComponent(val));
          if (val && elem.getAttribute('data-bind-last') === null) elem.setAttribute('data-bind-last', val);
          if (elem.innerHTML && elem.getAttribute('data-bind-last') != elem.innerHTML) elem.setAttribute('data-bind-last', elem.innerHTML);
          count = elem.getAttribute('data-bind-count');
          if (count === null) {
            elem.setAttribute('data-bind-count', 1);
          } else {
            elem.setAttribute('data-bind-count', parseFloat(count) + 1);
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
          set(model, key, val);
          state.push(dom[i]);
        } else {
          continue;
        }
      } else {
        continue;
      }
    }
    if (typeof fn != 'undefined') fn();
    return pub;
  };

  pub.revert = function(type, key) {
    var types = ['first', 'last'];
    if (typeof key == 'undefined') {
      key = type;
      type = 'first';
    }
    if (types.indexOf(type) > -1) {
      for (var i=0;i<state.length;++i) {
        var elem = state[i];
        if (elem.getAttribute('data-bind') == key && 
            elem.getAttribute('data-bind-' + type) !== null) {
          return pub.set(key, decodeURIComponent(elem.getAttribute('data-bind-' + type)));
        } 
      }
    }
    return pub;
  };

  pub.set = function(key, val, all) {
    set(model, key, val);
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