var messagingController = (function(w,d,$,pub) {

  var $container, conf, init, priv, process, processor;

  conf = {
    selector: '#msgContainer'
  };

  priv = {
    queue: [],
    log: [],
    visible: false,
    ready: false
  };

  init = function() {
    $container = $(conf.selector);
    priv.ready = true;
    processor();
  };

  processor = function() {
    var step = function(next) {
      process(next);
      processor();
    };
    if (!priv.visible && priv.queue.length) {
      var current = priv.queue.shift();
      step(current);
    }
  };

  process = function(msg) {
    priv.log.push(msg);
    priv.visible = true;
    $container.find('p').text(msg.text);
    if ($container.hasClass('hidden')) $container.removeClass('hidden');
    w.setTimeout(function() {
      if (!priv.queue.length) $container.addClass('hidden');
      priv.visible = false;
      if (msg.func) msg.func();
      processor();
    }, msg.delay);
  };

  pub.toggle = function(msg) {
    priv.queue.push(msg);
    if (priv.ready) processor();
  }

  $(d).ready(init);

  return function(cfg) {
    if (cfg) $.extend(conf, cfg);
    return pub;
  }
  
})(window,document,jQuery,{});