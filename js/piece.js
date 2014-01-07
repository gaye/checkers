define('piece', function() {
  function Piece() {
  };

  Piece.prototype = {
    player: null,
    king: null,
    row: null,
    col: null,

    equals: function(other) {
      return this.row === other.row && this.col === other.col;
    }
  };

  return Piece;
});
