define('clone', function() {
  function clone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    if (obj instanceof Array) {
      var copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
      }

      return copy;
    }

    if (obj instanceof Object) {
      var copy = {};
      for (var attr in obj) {
        copy[attr] = clone(obj[attr]);
      }

      return copy;
    }

    throw new Error('Unable to copy obj! Type not supported.');
  }

  return clone;
});
