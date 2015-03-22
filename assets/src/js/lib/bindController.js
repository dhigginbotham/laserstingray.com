var bindController = (function(w,d,$,pub) {
  
  var model, ready, state, subscribers;
  var api, bindElements, collectState, dots, init;

  model = {};
  pub.binding = false;
  ready = false;
  subscribers = {};

  api = function(context) {
    if (typeof context != 'undefined') $.extend(model, context);
    bindElements();
    return pub;
  };

  pub.bindElements = bindElements = function() {
    if (ready) {
      pub.binding = false;
      for (var i=0;i<state.length;++i) {
        var elem, val;
        elem = state[i];
        val = model[elem.getAttribute('data-bind')];
        if (val) {
          if (!elem.getAttribute('data-bound')) elem.setAttribute('data-bound', true);
          if (elem.getAttribute('data-bind-clean') === null) {
            elem.setAttribute('data-bind-clean', val);
          }
          elem.setAttribute('data-bind-dirty', val);
          var count = elem.getAttribute('data-bind-count');
          if (count === null) {
            elem.setAttribute('data-bind-count', 1);
          } else {
            elem.setAttribute('data-bind-count', ++count);
          }
          elem.innerText = val;
        } else {
          continue;
        }
      }
    }
  };

  pub.update = collectState = function() {
    pub.binding = true;
    state = d.getElementsByTagName('*');
    for (var i=0;i<state.length;++i) {
      var key, val;
      if (state[i].getAttribute('data-bound') === null) {
        key = state[i].getAttribute('data-bind');
        if (key !== null) {
          val = (state[i].innerText ? state[i].innerText : state[i].getAttribute('data-bind-clean'));
          model[key] = (val && !model[key] ? val : null);
        } else {
          continue;
        }
      }
    }
    $(d).ready(init);
  };

  dots = function(prop, obj) {
    var parts = prop.split('.'),
        last = parts.pop();
    while (prop = parts.shift()) {
      obj = obj[prop];
      if (typeof obj !== 'object' || !obj) return;
    }
    return obj[last];
  }

  pub.set = function(key, val) {
    model[key] = val;
    bindElements();
  };

  init = function() {
    ready = true;
    bindElements();
    pub.model = model;
    pub.state = state;
  };

  collectState();

  return api;

})(window,document,jQuery,{}); 
