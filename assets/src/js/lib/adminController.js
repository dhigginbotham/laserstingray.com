var adminController = (function(w,d,$,pub) {

  var api, bindElems, conf, debug, dom, events, init, msg, priv;

  api = apiServices();
  msg = messagingController();

  dom = {
    ready: false
  };
  
  events = {
    bound: false,
    tracking: []
  };
  
  priv = {};

  conf = {
    saveBlog: '#saveBlogBtn',
    deleteBlog: '#deleteBlogBtn',
    slug: '#slug',
    debug: true
  };

  events.saveBlog = function(e) {
    if (e) e.preventDefault();
    var $el, attrs, req;
    $el = $(this);
    attrs = $el.data();
    if (attrs.formSelector) {
      req = $(attrs.formSelector).serializeObject();
      if (req.title.length && req.body.length) {
        $el.addClass('disabled');
        priv.saveBlog(req, function(err, data) {
          if (err) {
            msg.toggle({
              text: 'Validation Error: ' + JSON.stringify(err), 
              delay: 2000, 
              func: function() {
                $el.removeClass('disabled');
              }
            });
          }
          if (data) {
            msg.toggle({text: 'Saved Post', delay: 2000});
            $el.removeClass('disabled');
          }
        });
      } else {
        msg.toggle({text: 'You must provide at least a title and content for your post', delay: 2000});
      }
    }
    return false;
  };

  events.deleteBlog = function(e) {
    if (e) e.preventDefault();
    var $el, attrs;
    $el = $(this);
    attrs = $el.data();
    if (attrs.id) {
      priv.deleteBlog(attrs.id, function(err, data) {
        if (err) return console.log(err);
        if (data) {
          // .. pass to message lib
        }
      });
    }
  };

  events.createSlug = function(e) {
    var $el, $title;
    $el = $(this);
    $title = $('#title');
    $el.val(!$el.val() ? helperUtils.slug($title.val()) : helperUtils.slug($el.val()));
  };

  priv.saveBlog = function(req, fn) {
    return api.post('blogs', req, fn);
  };

  priv.deleteBlog = function(id, fn) {
    return api.delete('blogs', {id: id}, fn);
  };

  bindElems = function() {
    if (!events.bound) {
      events.bound = true;
      if (dom[conf.saveBlog].length) {
        dom[conf.saveBlog].on('click', events.saveBlog);
        events.tracking.push(conf.saveBlog);
      }
      if (dom[conf.deleteBlog].length) {
        dom[conf.deleteBlog].on('click', events.deleteBlog);
        events.tracking.push(conf.deleteBlog);
      }
      if (dom[conf.slug].length) {
        dom[conf.slug].on('blur', events.createSlug);
        events.tracking.push(conf.slug);
      }
    }
  };

  debug = function() {
    pub.events = events;
    pub.dom = dom;
    pub.conf = conf;
  };

  init = function() {
    if (!dom.ready) {
      dom.ready = true;
      dom[conf.saveBlog] = $(conf.saveBlog);
      dom[conf.deleteBlog] = $(conf.deleteBlog);
      dom[conf.slug] = $(conf.slug);
      bindElems();
    }
  };

  $(d).ready(init);

  return function(cfg) {
    if (cfg) $.extend(conf, cfg);
    if (conf.debug) debug();
    return pub;
  };

})(window,document,jQuery,{});