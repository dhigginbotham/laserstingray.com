$.fn.serializeObject = function() {
  var obj = {};
  var arr = this.serializeArray();
  $.each(arr, function() {
    if (obj[this.name] !== undefined) {
      if (!obj[this.name].push) {
        obj[this.name] = [obj[this.name]];
      }
      obj[this.name].push(this.value || '');
    } else {
      obj[this.name] = this.value || '';
    }
  });
  return obj;
};

var dotLookup = function(prop, obj) {
  var parts = prop.split('.'),
      last = parts.pop();
  while (prop = parts.shift()) {
    obj = obj[prop];
    if (typeof obj !== 'object' || !obj) return;
  }
  return obj[last];
};