define('move', function() {
  function Move(opts) {
    if (opts) {
      for (var key in opts) {
        this[key] = opts[key];
      }
    }
  }

  Move.prototype = {
    row: null,
    col: null,
    captures: null,
    jump: null,
    start: null,

    inbounds: function() {
      return this.row >= 0 && this.row < 8 &&
             this.col >= 0 && this.col < 8;
    },

    toString: function() {
      return '(' + this.row + ', ' + this.col + ')';
    }
  };

  return Move;
});
