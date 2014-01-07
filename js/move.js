define('move', function() {
  function Move() {
  }

  Move.prototype = {
    row: null,
    col: null,
    captures: null,
    jump: null,

    inbounds: function() {
      return this.row >= 0 && this.row < 8 &&
             this.col >= 0 && this.col < 8;
    }
  };

  return Move;
});
