define('node', function() {
  function Node(opts) {
    if (opts) {
      for (var key in opts) {
        this[key] = opts[key];
      }
    }
  }

  Node.prototype = {
    children: null,
    depth: null,
    game: null,
    move: null,
    value: null,

    toString: function() {
      var result = {};
      var queue = [];
      queue.unshift(this);
      while (queue.length > 0) {
        var next = queue.pop();
        var depth = next.depth;
        if (!(depth in result)) {
          result[depth] = [];
        }

        if (next.move) {
          result[depth].push(next.move.toString() + ' = ' + next.value);
        }

        if (next.children) {
          next.children.forEach(function(child) {
            queue.unshift(child);
          });
        }
      }

      return JSON.stringify(result);
    }
  };

  return Node;
});
