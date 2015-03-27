var bindController = (function(w,d,$,pub) {
  
  /**
   * bind controller allows you to do easy data
   * binding from either your template layer or
   * added in later as an xhr response or similar
   *
   * example usage:
   * 1) <div data-bind="key" data-bind-first="some value"></div>
   *
   * var bc = bindController();
   * bc.model ... {key: 'some value'};
   *
   * ----
   *
   * 2) <div data-bind="key">some value</div>
   * 
   * var bc = bindController();
   * bc.model ... {key: 'some value'};
   *
   * ----
   * 
   */

  var model, ready, state;
  var api, bindElements, collectState, get, init, set;

  // helper dependencies
  get = helperUtils.get;
  set = helperUtils.set;

  // model, where our data will stay
  model = {};

  // interally keep track of dom ready state
  ready = false;

  // dom nodes we're binding on
  state = [];

  api = function(context) {
    if (typeof context == 'object') $.extend(model, context);
    bindElements();
    return pub;
  };

  /**
   * bind elements from state/model to dom
   * @param  {String} key optional, if not present will rebind all nodes
   */
  pub.bindElements = bindElements = function(k) {
    if (!ready) return pub;
    for (var i=0;i<state.length;++i) {
      var count, elem, inner, val, key;
      elem = state[i];
      key = (k ? k : elem.getAttribute('data-bind'));
      val = (!~key.indexOf('.') ? model[key] : get(key, model));
      inner = (elem.type ? elem.getAttribute('value') : elem.innerHTML);
      if (inner && inner == val) continue;
      if (key == elem.getAttribute('data-bind') && typeof val != 'undefined') {
        if (!elem.getAttribute('data-bound')) elem.setAttribute('data-bound', true);
        if (val && elem.getAttribute('data-bind-first') === null) elem.setAttribute('data-bind-first', encodeURIComponent(val));
        if (val && elem.getAttribute('data-bind-last') === null) elem.setAttribute('data-bind-last', val);
        if (inner && elem.getAttribute('data-bind-last') != inner) elem.setAttribute('data-bind-last', inner);
        count = elem.getAttribute('data-bind-count');
        if (count === null) {
          elem.setAttribute('data-bind-count', 1);
        } else {
          elem.setAttribute('data-bind-count', parseFloat(count) + 1);
        }
        if (elem.type) {
          elem.setAttribute('value', val);
        } else {
          elem.innerHTML = val;
        }
      } else {
        continue;
      }
    }
    return pub;
  };

  pub.update = collectState = function(context) {
    var ctx, dom;
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

  collectState();
  
  $(d).ready(init);

  return api;

})(window,document,jQuery,{});