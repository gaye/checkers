suite('Game', function() {
  var Game, Piece, subject;

  setup(function(done) {
    require(['game', 'piece'], function(_Game, _Piece) {
      Game = _Game;
      Piece = _Piece;
      subject = new Game();
      done();
    });
  });

  suite('constructor', function() {
    test('should generate a new board', function() {
      var rows = 0;
      var squares = 0;
      var pieces = 0;
      subject.board.forEach(function(row) {
        rows++;
        row.forEach(function(piece) {
          squares++;
          if (piece) {
            pieces++;
          }
        });
      });

      assert.equal(rows, 8);
      assert.equal(squares, 64);
      assert.equal(pieces, 24);
    });
  });

  suite('#alternateTurn', function() {
    test('should remove any selections', function() {
      subject.selected = subject.board[5][1];
      assert.notEqual(subject.selected, null);
      subject.alternateTurn();
      assert.equal(subject.selected, null);
    });

    test('should switch player', function() {
      subject.player = 1;
      subject.alternateTurn();
      assert.equal(subject.player, -1);
    });
  });

  suite('#expandMoves', function() {
    test('should find slide', function() {
      var moves = subject.expandMoves(subject.board[5][1]);
      var expected = [
        { row: 4, col: 2},
        { row: 4, col: 0}
      ];

      assert.ok(moves.every(function(move) {
        return expected.some(function(expect) {
          return move.row === expect.row &&
                 move.col === expect.col;
        });
      }));
    });

    test('should find jump', function() {
      var piece = new Piece();
      piece.player = -1;
      piece.row = 4;
      piece.col = 2;
      subject.board[4][2] = piece;

      var moves = subject.expandMoves(subject.board[5][1]);
      assert.ok(moves.some(function(move) {
        return move.jump;
      }));
    });
  });
});
