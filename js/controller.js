define('controller', function() {
  function Controller() {
    this.onSpace = this.onSpace.bind(this);
    window.addEventListener('space', this.onSpace);
  }

  Controller.prototype = {
    game: null,

    view: null,

    onSpace: function(event) {
      var board = this.game.board;
      var row = event.detail.row;
      var col = event.detail.col;
      var piece = board[row][col];

      if (piece) {
        this.select(piece);
      } else {
        this.move(row, col);
      }
    },

    move: function(row, col) {
      var game = this.game;
      var selected = game.selected;
      if (!selected) {
        return;
      }

      // Check to see if the move is available.
      var board = game.board;
      var moves = game.moves;
      moves.forEach(function(move) {
        if (move.row !== row || move.col !== col) {
          return;
        }

        board[selected.row][selected.col] = null;
        board[move.row][move.col] = selected;
        selected.row = move.row;
        selected.col = move.col;
        if (selected.row === 0 || selected.row === 7) {
          selected.king = true;
        }

        move.captures.forEach(function(capture) {
          board[capture.row][capture.col] = null;
        });

        game.alternateTurn();
        return this.view.render();
      }.bind(this));
    },

    select: function(piece) {
      var game = this.game;
      if (piece.player !== game.player) {
        return;
      }

      var selected = game.selected;
      if (selected && selected.equals(piece)) {
        game.select(null);
      } else {
        game.select(piece);
      }

      return this.view.render();
    }
  };

  return Controller;
});
