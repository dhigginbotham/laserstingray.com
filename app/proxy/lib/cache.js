// require deps

var cache = {};

cache.ms = function(date) {
  date = (typeof date != 'undefined' ? new Date(date) : new Date());
  return date.now();
};

cache.timeBetween = function(start, end) {
  return end - start;
};

// this is where we'll keep all of our caching
// methods for reference inside of our api proxy
// layer
cache.crud = {};