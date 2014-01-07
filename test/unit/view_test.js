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

  suite('#onClick', function() {
    var dispatchEvent;

    setup(function() {
      dispatchEvent = sinon
        .mock(window)
        .expects('dispatchEvent');

      var event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });

      event.pageX = 500;
      event.pageY = 500;
      subject.canvas.dispatchEvent(event);
    });

    teardown(function() {
      window.dispatchEvent.restore();
    });

    test('should dispatch "space" event on window', function() {
      dispatchEvent.verify();
    });
  });

  test.skip('#render', function() {
  });
});
