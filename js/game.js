define('game', function() {
  function Game() {
    this.initBoard();
    this.player = 1;
    this.selected = null;
    this.moves = [];
  }

  Game.prototype = {
    board: null,
    player: null,
    selected: null,
    moves: null,

    initBoard: function() {
      this.board = [];
      for (var i = 0; i < 8; i++) {
        var row = [];
        for (var j = 0; j < 8; j++) {
          var piece;
          if ((i < 3 || i > 4) /* Not in the middle */ &&
              (i % 2 === j % 2) /* Black square */) {
            piece = new Piece();
            piece.player = i > 4 ? 1 : -1;
            piece.king = false;
            piece.row = i;
            piece.col = j;
          } else {
            piece = null;
          }

          row.push(piece);
        }

        this.board.push(row);
      }
    },

    alternateTurn: function() {
      this.select(null);
      this.player = this.player === 1 ? -1 : 1;
    },

    select: function(piece) {
      this.selected = piece;
      this.moves = piece ? this.computeMoves(piece) : [];
    },

    computeMoves: function(piece) {
      var moveset = [];
      var board = this.board;

      var directions = piece.king ? ['ul', 'ur', 'dl', 'dr'] : ['ul', 'ur'];
      var stack = [];
      stack.push({
        row: piece.row,
        col: piece.col,
        mustJump: false,
        captures: []
      });
      while (stack.length !== 0) {
        var next = stack.pop();
        var row = next.row;
        var col = next.col;

        for (var i = 0; i < directions.length; i++) {
          var direction = directions[i];
          var slideRow, slideCol;
          var jumpRow, jumpCol;
          switch (direction) {
            case 'ul':
              slideRow = row - this.player;
              slideCol = col - this.player;
              jumpRow = slideRow - this.player;
              jumpCol = slideCol - this.player;
              break;
            case 'ur':
              slideRow = row - this.player;
              slideCol = col + this.player;
              jumpRow = slideRow - this.player;
              jumpCol = slideCol + this.player;
              break;
            case 'dl':
              slideRow = row + this.player;
              slideCol = col - this.player;
              jumpRow = slideRow + this.player;
              jumpCol = slideCol - this.player;
              break;
            case 'dr':
              slideRow = row + this.player;
              slideCol = col + this.player;
              jumpRow = slideRow + this.player;
              jumpCol = slideCol + this.player;
              break;
          }

          var move;
          if (!next.mustJump) {
            if (slideRow < 0 || slideRow >= 8 ||
                slideCol < 0 || slideCol >= 8) {
              continue;
            }

            // Open space?
            if (!board[slideRow][slideCol]) {
              move = {
                row: slideRow,
                col: slideCol,
                mustJump: false,
                captures: []
              };
              moveset.push(move);
              continue;
            }
          }

          if (jumpRow < 0 || jumpRow >= 8 ||
              jumpCol < 0 || jumpCol >= 8) {
            continue;
          }

          // Jump?
          if (board[slideRow][slideCol] &&
              board[slideRow][slideCol].player !== this.player &&
              !board[jumpRow][jumpCol]) {
            if (next.previous &&
                next.previous.row === jumpRow &&
                next.previous.col === jumpCol) {
              continue;
            }

            var captures = next.captures || [];
            captures.push({ row: slideRow, col: slideCol });
            move = {
              row: jumpRow,
              col: jumpCol,
              mustJump: true,
              captures: captures,
              previous: {
                row: row,
                col: col
              }
            };

            moveset.push(move);
            stack.push(move);
          }
        }
      }

      return moveset;
    }
  };

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

  return Game;
});
