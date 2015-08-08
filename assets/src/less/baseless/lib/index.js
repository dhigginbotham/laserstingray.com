/**
 * baseless dss parsing, this is where 
 * the magic will happen mostly. highly
 * volitile, subject to refactor at any
 * notice.
 * 
 */

var path = require('path'),
    dss = require('dss'),
    fs = require('fs'),
    less = require('less'),
    _ = require('lodash');

var dir = path.join(__dirname, '..', 'less');
var style = path.join(dir, 'style.less');

function Builder(opts) {

  if (!(this instanceof Builder)) return new Builder(opts);

  this.dir = null;
  this.style = null;

  if (opts) _.merge(this, opts);

  this.output = null;

  var self = this;

  this.init = function() {
    fs.readFile(self.style, function(err, data) {
      var buf = new Buffer(data);
      if (err) return console.log('\r\n\r\nreadFile error: \r\n', err);
      less.render(buf.toString(), {
        paths: [self.dir], 
        modifyVars: {
          'css-prefix': self.modifyVar
        }
      }, function(err, css) {
        console.log(css);
        if (err) return console.log('\r\n\r\nless error: \r\n', err);
        dss.parse(css, {}, function(parsed) {
          console.log(JSON.stringify(parsed));
        });
      });
    });
  };

  if (this.style) {
    this.init();
  }

  return this;

}

var builder = Builder({dir: dir, style: style, modifyVar: 'bs-'});

var questions = (function(w,d,$,pub,dev,autoClick) {
  var state = {}, formHandlers = {};
  var init, collectContainers, createElemObject, navigateToInterviewPage, navigateToNextPage;

  // common options used inside class  
  state.opts = {
    zipCode: 99547,
    taskOid: 40382,
    futureZip: 99547,
    questionContainer: '.question-container',
    emergencyExcludeId: 'id_8152_10001',
    futureZipInputId: 'id_200204',
    futureYearSelectName: '200192_yyyy',
    futureDaySelectName: '200192_dd',
    futureMonthSelectName: '200192_mm',
    textDateInputId: 'id_200192'
  };

  // array of question containers in the dom
  state.containers = [];

  // collection of objs with ref to our elem
  // and other saved data 
  state.collections = [];

  // collects question containers and applies
  // formHandlers on elems that meet the criteria
  collectContainers = function() {

    // select containers in dom, turn back into regular js array
    state.containers = $(state.opts.questionContainer).toArray();

    // loops through each question set container
    for (var i=0;i<state.containers.length;++i) {
      var container, elems;
      container = state.containers[i];
      elems = container.getElementsByTagName('*');

      // loop through each of our elems to apply
      // formHandlers
      for(var j=0;j<elems.length;++j) {
        var elem, type, obj; 
        elem = elems[j];
        type = (elem.getAttribute('type') ? elem.getAttribute('type') : elem.tagName).toLowerCase();

        // nothing but form inputs are going to
        // have a name inside of .question-container
        if (elem.getAttribute('name')) {

          // switch through our `type` and apply
          // the appropriate formHandlers
          switch(type) {
            case "select":
              obj = formHandlers.selectOption(elem);
              break;
            case "text":
              obj = formHandlers.textLinkInput(elem);
              break;
            case "checkbox":
            case "radio":
              obj = formHandlers.checkOrRadio(elem);
              break;
            default: 
              console.log('unsupported type: ', type, elem);
              break;
          }

          // keep reference of collections
          state.collections.push(obj);

          if (obj.multi) {
            // this indicates whether there are multiple
            // fields required inside of the question row
            // if there are, we won't break, we'll continue
            // handling the question row
            continue;
          } else {
            // we break here so we only interact with 
            // one elem per question set container
            break;
          }
        }
      }
    }
    if (autoClick) return navigateToNextPage();
    return state.collections;
  };

  // creates our element object that we
  // use to validate against in other
  // context, these will likely be public
  createElemObject = function(elem) {
    return {
      elem: elem,
      id: elem.getAttribute('id'),
      multi: false,
      name: elem.getAttribute('name'),
      type: (elem.getAttribute('type') ? elem.getAttribute('type') : elem.tagName).toLowerCase()
    };
  };

  // init function, puts all the pieces 
  // together <3
  init = function() {
    collectContainers();
    if (dev) $.extend(pub, state);
  };

  // handles text, link and button inputs
  formHandlers.textLinkInput = function(elem) {
    if (elem.getAttribute('id') == state.opts.futureZipInputId) {
      elem.setAttribute('value', state.opts.futureZip);
    } else if (elem.getAttribute('id') == state.opts.textDateInputId) {
      var date = new Date();
      var futureDate = ((date.getMonth() + 2) + '/' + date.getDate() + '/' +  date.getFullYear());
      elem.setAttribute('value', futureDate);
    } else {
      elem.setAttribute('value', state.opts.zipCode);
    }
    return createElemObject(elem);
  };

  // handles checkbox and radio inputs
  formHandlers.checkOrRadio = function(elem) {
    // we support "is this an emergency", lets
    // not play with that, also if something is
    // already checked, just leave it alone.
    if ((elem.getAttribute('id') != state.opts.emergencyExcludeId) && (!elem.checked)) {
      $(elem).trigger('click');
    }
    return createElemObject(elem);
  };

  // handles selects and their options
  formHandlers.selectOption = function(elem, si) {
    var elemObj = createElemObject(elem);
    // we support some weird date things, this isn't perfect
    // but it sets the date to the end of the year, this should mostly
    // cover for your scenarios
    if (elem.getAttribute('name') == state.opts.futureMonthSelectName) {
      elem.selectedIndex = elem.options.length-1;
      elemObj.multi = true;
    } else if (elem.getAttribute('name') == state.opts.futureDaySelectName) {
      elem.selectedIndex = elem.options.length-1;
      elemObj.multi = true;
    } else if (elem.getAttribute('name') == state.opts.futureYearSelectName) {
      // @todo: make this always go six months in the future, adjust year
      elem.selectedIndex = elem.options.length-2;
      elemObj.multi = true;
    } else {
      elem.selectedIndex = (typeof si != 'undefined' ? si : 2);
    }
    return elemObj;
  };

  // navigate to task interview page
  navigateToInterviewPage = function(task, zip) {
    task = (typeof task == 'undefined' ? state.opts.taskOid : task);
    zip = (typeof zip == 'undefined' ? state.opts.zipCode : zip);
    w.location = 'http://www.homeadvisor.com/sm/cattaskzip?oid=' + task + '&zip=' + zip;
  };

  // navigates to the next page
  navigateToNextPage = function() {
    $('#click-here').trigger('click');
  };

  $(d).ready(init);

  pub.collectContainers = collectContainers;
  pub.formHandlers = formHandlers;
  
  if (dev) {
    pub.navigateToInterviewPage = navigateToInterviewPage;
    pub.navigateToNextPage = navigateToNextPage;
  }

  return pub;

})(window, document, jQuery, {}, true, false);