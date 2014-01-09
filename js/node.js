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

    size: function() {
      var result = 0;
      if (this.children) {
        this.children.forEach(function(child) {
          result += child.size();
        });
      }

      return 1 + result;
    },

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
