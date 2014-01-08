(function() {
  requirejs.config({
    baseUrl: 'js'
  });

  requirejs([
    'controller',
    'game',
    'view'
  ], function(Controller, Game, View) {
    var game = new Game();
    game.init();
    var view = new View();
    view.game = game;
    var controller = new Controller();
    controller.game = game;
    controller.view = view;
    view.render();
  });
})();
