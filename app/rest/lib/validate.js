module.exports = function validate(schema, json, fn) {
  var callback, copy, emitError, errors, step; 

  copy = Array.prototype.slice.call(schema);
  keys = Object.keys(json);

  errors = [];

  emitError = function(val) {
    errors.push({validation: val});
  };

  callback = function() {
    if (errors.length) {
      return fn(errors, null);
    } else {
      return fn(null, true);
    }
  }

  step = function(next) {
    var min = (next.minlength ? next.minlength : 0);
    var max = (next.maxlength ? next.maxlength : 0);
    if (!~keys.indexOf(next.key)) emitError('missing required key ' + next.key);
    if (min > json[next.key].length) {
      emitError('value is too short for key ' + next.key);
    }
    if (max && max < json[next.key].length) {
      emitError('value is too long for key ' + next.key);
    }
    if (copy.length) {
      return step(copy.shift());
    } else {
      return callback();
    }
  };
  
  if (copy.length) {
    return step(copy.shift());
  } else {
    return callback();
  }
};
