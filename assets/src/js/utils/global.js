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