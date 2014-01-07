define('game', ['move', 'piece'], function(Move, Piece) {
  function Game() {
    this.board = generateBoard();
    this.player = 1;
    this.selected = null;
    this.moves = [];
  }

  Game.prototype = {
    board: null,
    player: null,
    selected: null,
    moves: null,

    alternateTurn: function() {
      this.select(null);
      this.player = this.player === 1 ? -1 : 1;
    },

    select: function(piece) {
      this.selected = piece;
      this.moves = piece ? this.expandMoves(piece) : [];
    },

    expandMoves: function(piece) {
      var moves = [];

      var move = new Move();
      move.row = piece.row;
      move.col = piece.col;
      move.jump = false;
      move.captures = [];

      var stack = [move];
      while (stack.length !== 0) {
        var next = stack.pop();
        var expand = this.expand(next, this.board, piece.player, piece.king);
        expand.forEach(function(found) {
          moves.push(found);
          if (found.jump) {
            stack.push(found);
          }
        });
      }

      return moves;
    },

    expand: function(move, board, player, king) {
      var row = move.row,
          col = move.col;

      var directions = ['ul', 'ur'];
      if (king) {
        directions = directions.concat(['dl', 'dr']);
      }

      var moves = [];
      directions.forEach(function(direction) {
        var slideMove = new Move();
        slideMove.jump = false;
        slideMove.captures = [];
        var jumpMove = new Move();
        jumpMove.jump = true;
        jumpMove.captures = move.captures;

        switch (direction) {
          case 'ul':
            slideMove.row = row - player;
            slideMove.col = col - player;
            jumpMove.row = slideMove.row - player;
            jumpMove.col = slideMove.col - player;
            break;
          case 'ur':
            slideMove.row = row - player;
            slideMove.col = col + player;
            jumpMove.row = slideMove.row - player;
            jumpMove.col = slideMove.col + player;
            break;
          case 'dl':
            slideMove.row = row + player;
            slideMove.col = col - player;
            jumpMove.row = slideMove.row + player;
            jumpMove.col = slideMove.col - player;
            break;
          case 'dr':
            slideMove.row = row + player;
            slideMove.col = col + player;
            jumpMove.row = slideMove.row + player;
            jumpMove.col = slideMove.col + player;
            break;
        }

        if (!move.jump &&
            slideMove.inbounds() &&
            !board[slideMove.row][slideMove.col]) {
          // We can still slide.
          return moves.push(slideMove);
        }

        if (jumpMove.inbounds()) {
          var capture = board[slideMove.row][slideMove.col];
          if (capture && capture.player !== player &&
              !board[jumpMove.row][jumpMove.col]) {
            if (move.previous &&
                move.previous.row === jumpMove.row &&
                move.previous.col === jumpMove.col) {
              return;
            }

            jumpMove.captures.push({ row: capture.row, col: capture.col });
            jumpMove.previous = { row: move.row, col: move.col };
            return moves.push(jumpMove);
          }
        }
      });

      return moves;
    }
  };

  function generateBoard() {
    var board = [];
    for (var i = 0; i < 8; i++) {
      var row = [];
      for (var j = 0; j < 8; j++) {
        var piece = null;
        if ((i < 3 || i > 4) && (i % 2 === j % 2)) {
          piece = new Piece();
          piece.player = i > 4 ? 1 : -1;
          piece.king = false;
          piece.row = i;
          piece.col = j;
        }

        row.push(piece);
      }

      board.push(row);
    }

    return board;
  }

  return Game;
});
