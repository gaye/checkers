define('view', function() {
  function View() {
    this.onClick = this.onClick.bind(this);
    this.canvas.addEventListener('click', this.onClick);
  }

  View.WHITE = 'rgb(255, 255, 255)';
  View.BLACK = 'rgb(0, 0, 0)';
  View.BLUE = 'rgb(0, 0, 255)';
  View.RED = 'rgb(255, 0, 0)';
  View.PURPLE = 'rgb(255, 0, 255)';
  View.BROWN = 'rgb(255, 255, 0)';

  View.prototype = {
    game: null,

    get canvas() {
      return document.getElementsByClassName('board')[0];
    },

    render: function() {
      var board = this.game.board;
      var canvas = this.canvas;
      var context = canvas.getContext('2d');
      var height = canvas.height;
      var width = canvas.width;
      var square = height / 8;

      // Paint everything white.
      context.fillStyle = View.WHITE;
      context.fillRect(0, 0, width, height);

      // Paint black squares.
      context.fillStyle = View.BLACK;
      board.forEach(function(row, i) {
        row.forEach(function(col, j) {
          if (i % 2 !== j % 2) {
            return;
          }

          var x = j * square;
          var y = i * square;
          context.fillRect(x, y, square, square);
        });
      });

      // Paint pieces.
      board.forEach(function(row, i) {
        board.forEach(function(col, j) {
          var piece = board[i][j];
          if (piece === null) {
            return;
          }

          var x = j * square + square / 2;
          var y = i * square + square / 2;
          var r = 0.75 * square / 2;
          var start = 0;
          var end = 2 * Math.PI;
          context.fillStyle = View[piece.player === 1 ? 'BLUE' : 'RED'];
          context.beginPath();
          context.arc(x, y, r, start, end);
          context.closePath();
          context.fill();

          if (piece.king) {
            r = 0.5 * square / 2;
            context.fillStyle = View.BROWN;
            context.beginPath();
            context.arc(x, y, r, start, end);
            context.closePath();
            context.fill();
          }
        }.bind(this));
      }.bind(this));

      // Highlight selected piece.
      var selected = this.game.selected;
      context.fillStyle = View.PURPLE;
      if (selected !== null) {
        var x = selected.col * square + square / 2;
        var y = selected.row * square + square / 2;
        var r = 0.75 * square / 2;
        var start = 0;
        var end = 2 * Math.PI;
        context.beginPath();
        context.arc(x, y, r, start, end);
        context.closePath();
        context.fill();
      }

      // Highlight potential moves.
      var moves = this.game.moves;
      context.fillStyle = View.PURPLE;
      moves.forEach(function(move) {
        var x = move.col * square;
        var y = move.row * square;
        context.fillRect(x, y, square, square);
      });
    },

    onClick: function(event) {
      var canvas = this.canvas;
      var height = canvas.height;
      var width = canvas.width;
      var square = height / 8;

      var col = Math.floor((event.pageX - canvas.offsetLeft) / square);
      var row = Math.floor((event.pageY - canvas.offsetTop) / square);
      var detail = { row: row, col: col };
      var space = new CustomEvent('space', { detail: detail });
      window.dispatchEvent(space);
    }
  };

  return View;
});
