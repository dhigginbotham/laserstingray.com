module.exports = function validate(schema, json, fn) {
  var copy = Array.prototype.slice.call(schema);
  var keys = Object.keys(json);

  var errors = [];

  var registerKeyError = function(val) {
    errors.push({validation: val});
  };

  var callback = function() {
    if (errors.length) {
      return fn(errors, null);
    } else {
      return fn(null, true);
    }
  }

  var step = function(next) {
    var min = (next.minlength ? next.minlength : 0);
    var max = (next.maxlength ? next.maxlength : 0);
    if (!~keys.indexOf(next.key)) registerKeyError('missing required key ' + next.key);
    if (min > json[next.key].length) {
      registerKeyError('value is too short for key ' + next.key);
    }
    if (max && max < json[next.key].length) {
      registerKeyError('value is too long for key ' + next.key);
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
