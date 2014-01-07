suite('Controller', function() {
  var Controller, Game, subject, game;

  setup(function(done) {
    require([
      'controller',
      'game'
    ], function(_Controller, _Game) {
      Controller = _Controller;
      Game = _Game;
      subject = new Controller();
      game = new Game();
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

    test.skip('should jump and remove opponent', function() {
    });

    test.skip('should double jump and remove opponents', function() {
    });

    test.skip('should triple jump and remove opponents', function() {
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
