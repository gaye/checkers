suite('search', function() {
  var Game, Piece, Search, subject;

  setup(function(done) {
    require(['game', 'piece', 'search'], function(_Game, _Piece, _Search) {
      Game = _Game;
      Piece = _Piece;
      Search = _Search;
      subject = new Search();
      done();
    });
  });

  suite('#search', function() {
    // TODO
  });
});
