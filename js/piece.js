define('piece', function() {
  function Piece(opts) {
    if (opts) {
      for (var key in opts) {
        this[key] = opts[key];
      }
    }
  };

  Piece.prototype = {
    player: null,
    king: null,
    row: null,
    col: null,
    dead: null,

    equals: function(other) {
      return this.row === other.row && this.col === other.col;
    },

    toString: function() {
      return '(' + this.row + ', ' + this.col + ')';
    }
  };

  return Piece;
});
