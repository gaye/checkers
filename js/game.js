define('game', ['move', 'piece', 'clone'], function(Move, Piece, clone) {
  function Game() {
    this.player = 1;
    this.selected = null;
    this.moves = [];
  }

  Game.prototype = {
    board: null,
    player: null,
    selected: null,
    moves: null,
    _playerToPieces: null,

    init: function() {
      var board = [];
      var playerToPieces = { '1': [], '-1': [] };
      for (var i = 0; i < 8; i++) {
        var row = [];
        for (var j = 0; j < 8; j++) {
          var piece = null;
          if ((i < 3 || i > 4) && (i % 2 === j % 2)) {
            var player = i > 4 ? 1 : -1;
            piece = new Piece({
              col: j,
              king: false,
              player: player,
              row: i,
              dead: false
            });
            playerToPieces[player].push(piece);
          }

          row.push(piece);
        }

        board.push(row);
      }

      this.board = board;
      this._playerToPieces = playerToPieces;
    },

    move: function(move) {
      var board = this.board;
      var selected = this.selected;

      // Update the board.
      board[selected.row][selected.col] = null;
      board[move.row][move.col] = selected;

      // Update the piece.
      selected.row = move.row;
      selected.col = move.col;
      if (move.row === 0 || move.row === 7) {
        selected.king = true;
      }

      // Remove the captured pieces.
      for (var i = 0; i < move.captures.length; i++) {
        var capture = move.captures[i];
        board[capture.row][capture.col].dead = true;
        board[capture.row][capture.col] = null;
      }

      // Switch player.
      this.alternateTurn();
    },

    alternateTurn: function() {
      // Remove any selections.
      this.select(null);

      this.player = this.player === 1 ? -1 : 1;
    },

    select: function(row, col, dontExpand) {
      var piece = (typeof row === 'number' && typeof col === 'number') ?
        this.board[row][col] : null;
      this.selected = piece;
      this.moves = [];
      if (piece && !dontExpand) {
        this.moves = this.expandMoves(piece);
      }
    },

    expandMoves: function(piece) {
      var moves = [];

      var move = new Move({
        captures: [],
        col: piece.col,
        jump: false,
        row: piece.row,
        start: piece
      });

      var stack = [move];
      while (stack.length > 0) {
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
        var slideMove = new Move({ captures: [], jump: false });
        var jumpMove = new Move({ captures: clone(move.captures), jump: true });

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
    },

    // playerToPieces: function(player) {
    //   var pieces = this._playerToPieces[player];
    //   return pieces.filter(function(piece) {
    //     return !!piece && !piece.dead;
    //   });
    // },

    playerToPieces: function(player) {
      var result = { '-1': [], '1': [] };
      this.board.forEach(function(row, i) {
        row.forEach(function(piece, j) {
          if (piece) {
            result[piece.player].push(piece);
          }
        }.bind(this));
      }.bind(this));

      return result[player];
    },

    toString: function() {
      return '\n' + this.board.map(function(row) {
        return row.map(function(piece) {
          return piece ? Math.max(0, piece.player) : 'x';
        }).join(' ');
      }).join('\n');
    }
  };

  return Game;
});
