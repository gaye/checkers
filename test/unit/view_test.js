suite('View', function() {
  var View, Game, subject, game, canvas;

  setup(function(done) {
    canvas = document.createElement('canvas');
    canvas.height = 560;
    canvas.width = 560;
    canvas.className = 'board';
    document.body.appendChild(canvas);

    require([
      'view',
      'game'
    ], function(_View, _Game) {
      View = _View;
      Game = _Game;
      subject = new View();
      game = new Game();
      game.init();
      subject.game = game;
      done();
    });
  });

  suite('constructor', function() {
    var addEventListener;

    setup(function() {
      addEventListener = sinon
        .mock(canvas)
        .expects('addEventListener')
        .withArgs('click');
      new View();
    });

    teardown(function() {
      canvas.addEventListener.restore();
    });

    test('should listen to canvas for "click" events', function() {
      addEventListener.verify();
    });
  });

  test.skip('#render', function() {
  });
});
