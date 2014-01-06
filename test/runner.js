var assert;

requirejs.config({
  baseUrl: '/../js/',
  paths: {
    'chai': '../node_modules/chai/chai',
    'mocha': '../test/resources/mocha',
    'sinon': '../node_modules/sinon/pkg/sinon'
  }
});

require(['chai', 'mocha', 'sinon'], function(chai) {
  assert = chai.assert;
  mocha.setup('tdd');
  require([
    '../test/unit/controller_test',
    '../test/unit/game_test',
    '../test/unit/view_test'
  ], function() {
    mocha.run();
  });
});
