var bindController = (function(w,d,$,pub) {
  var model, state;
  var api, bindElements, collectState, init;

  model = {};
  pub.bound = false;

  api = function(context) {
    if (typeof context != 'undefined') $.extend(model, context);
    bindElements();
    return pub;
  };

  pub.bind = bindElements = function() {
    for (var i=0;i<state.length;++i) {
      var val = model[state[i].getAttribute('data-bind')];
      if (val) {
        if (!state[i].getAttribute('data-bound')) state[i].setAttribute('data-bound', true);
        state[i].innerText = val;
      } else {
        continue;
      }
    }
  };

  pub.update = collectState = function(el) {
    pub.bound = true;
    state = (el ? el.getElementsByTagName('*') : d.getElementsByTagName('*'));
    for (var i=0;i<state.length;++i) {
      var key, found, val;
      if (state[i].getAttribute('data-bound') === null) {
        key = state[i].getAttribute('data-bind');
        if (key !== null) {
          val = (state[i].innerText ? state[i].innerText : state[i].getAttribute('data-val'));
          if (val && !model[key]) {
            model[key] = val;
          } else {
            model[key] = null;
          }
        } else {
          continue;
        }
      }
    }
    bindElements();
  };

  pub.set = function(key, val) {
    model[key] = val;
    bindElements();
  };

  init = function() {
    if (!pub.bound) collectState();
    pub.model = model;
    pub.state = state;
  };

  collectState();

  $(d).ready(init);

  return api;

})(window,document,jQuery,{}); 