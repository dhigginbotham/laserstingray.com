var messagingController = (function(w,d,$,pub) {

  var $container, conf, init, process, processor, state;

  conf = {
    selector: '#msgContainer'
  };

  state = {
    queue: [],
    log: [],
    visible: false,
    ready: false
  };

  init = function() {
    $container = $(conf.selector);
    state.ready = true;
    processor();
  };

  processor = function() {
    var step = function(next) {
      process(next);
      processor();
    };
    if (!state.visible && state.queue.length) {
      var current = state.queue.shift();
      step(current);
    }
  };

  process = function(msg) {
    state.log.push(msg);
    state.visible = true;
    $container.find('p').text(msg.text);
    if ($container.hasClass('hidden')) $container.removeClass('hidden');
    w.setTimeout(function() {
      if (!state.queue.length) $container.addClass('hidden');
      state.visible = false;
      if (msg.func) msg.func();
      processor();
    }, msg.delay);
  };

  pub.toggle = function(msg) {
    state.queue.push(msg);
    if (state.ready) processor();
  }

  $(d).ready(init);

  return function(cfg) {
    if (cfg) $.extend(conf, cfg);
    return pub;
  }
  
})(window,document,jQuery,{});