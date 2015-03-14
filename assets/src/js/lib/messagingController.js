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
      var fn = (next.func ? next.func : function(){});
      priv.log.push(next);
      process(next.text, next.time, fn);
      processor();
    };
    if (!priv.visible && priv.queue.length) {
      var current = priv.queue.shift();
      step(current);
    }
  };

  process = function(text, time, fn) {
    priv.visible = true;
    $container.find('p').text(text);
    if ($container.hasClass('hidden')) $container.removeClass('hidden');
    w.setTimeout(function() {
      if (!priv.queue.length) $container.addClass('hidden');
      priv.visible = false;
      fn();
      processor();
    }, time);
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