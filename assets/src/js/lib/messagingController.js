var messagingController = (function(w,d,$,pub) {

  var $container, conf, init, priv, process, processor;

  conf = {
    selector: '#msgContainer'
  };

  priv = {
    queue: [],
    log: [],
    visible: false
  };

  init = function() {
    $container = $(conf.selector);
    processor();
  };

  processor = function() {
    var step = function(next) {
      priv.log.push(next);
      process(next.text, next.time);
      processor();
    };
    if (!priv.visible && priv.queue.length) {
      var current = priv.queue.shift();
      step(current);
    }
  };

  process = function(text, time) {
    priv.visible = true;
    $container.find('p').text(text + ' :: ' + priv.log.length);
    $container.removeClass('hidden');
    w.setTimeout(function() {
      if (!priv.queue.length) {
        $container.addClass('hidden');
      }
      priv.visible = false;
      processor();
    }, time);
  };

  pub.toggle = function(msg) {
    priv.queue.push(msg);
    console.log(priv.queue.length);
    processor();
  }

  $(d).ready(init);

  return function(cfg) {
    if (cfg) $.extend(conf, cfg);
    return pub;
  }
  
})(window,document,jQuery,{});