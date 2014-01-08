suite('Controller', function() {
  var Controller, Game, Piece, subject, game;

  setup(function(done) {
    require([
      'controller',
      'game',
      'piece'
    ], function(_Controller, _Game, _Piece) {
      Controller = _Controller;
      Game = _Game;
      Piece = _Piece;
      subject = new Controller();
      game = new Game();
      game.init();
      subject.game = game;
      subject.view = { render: function() {} };
      done();
    });
  });

  suite('constructor', function() {
    var addEventListener;

    setup(function() {
      addEventListener = sinon
        .mock(window)
        .expects('addEventListener')
        .withArgs('space');
      new Controller();
    });

    teardown(function() {
      window.addEventListener.restore();
    });

    test('should listen to window for "space" events', function() {
      addEventListener.verify();
    });
  });

  suite('#onSpace', function() {
    test('should select piece if space has piece', function() {
      subject.onSpace.call(
        subject, new CustomEvent('space', { detail: { row: 5, col: 1 } }));
      assert.equal(game.selected.row, 5);
      assert.equal(game.selected.col, 1);
    });

    test('should move to column if space open', function() {
      assert.equal(game.board[4][2], null);
      subject.select(game.board[5][1]);
      subject.onSpace.call(
        subject, new CustomEvent('space', { detail: { row: 4, col: 2 } }));
      assert.notEqual(game.board[4][2], null);
    });
  });

  suite('#move', function() {
    test('should noop if no piece selected', function() {
      subject.move(4, 2);
      assert.equal(game.board[4][2], null);
    });

    test('should noop if bad move', function() {
      subject.select(game.board[5][1]);
      subject.move(4, 1);
      assert.equal(game.board[4][1], null);
    });

    test('should move piece if space open', function() {
      assert.equal(game.board[4][2], null);
      subject.select(game.board[5][1]);
      subject.move(4, 2);
      assert.notEqual(game.board[4][2], null);
    });

    test('should not jump own color', function() {
      subject.select(game.board[5][1]);
      subject.move(4, 2);
      subject.select(game.board[5][3]);
      // Try to jump our own piece.
      subject.move(3, 1);
      // Should not work.
      assert.equal(game.board[3][1], null);
      assert.notEqual(game.board[4][2], null);
    });

    test('should jump and remove opponent', function() {
      var piece = new Piece();
      piece.player = -1;
      piece.row = 4;
      piece.col = 2;
      game.board[4][2] = piece;

      subject.select(game.board[5][1]);
      subject.move(3, 3);
      assert.equal(game.board[4][2], null);
      assert.notEqual(game.board[3][3], null);
    });
  });

  suite('#select', function() {
    test('should noop if not our piece', function() {
      subject.select(game.board[0][0]);
      assert.equal(game.selected, null);
    });

    test('should unselect if already selected', function() {
      game.selected = game.board[5][1];
      subject.select(game.board[5][1]);
      assert.equal(game.selected, null);
    });

    test('should set selected', function() {
      subject.select(game.board[5][1]);
      assert.deepEqual(game.selected, game.board[5][1]);
    });
  });
});
