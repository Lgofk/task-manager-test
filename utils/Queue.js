function Queue() {
  this._list = new Array();
}

Queue.prototype = {
  isEmpty: function () {
    return !this._list.length;
  },

  size: function () {
    return this._list.length;
  },

  enqueue: function (data) {
    return this._list = [...this._list, data];
  },

  dequeue: function () {
    if (this.isEmpty()) {
      return null;
    }
    return this._list.shift();
  },

  peek: function () {
    if (this.isEmpty()) {
      return null;
    }
    return this._list[0];
  }
}

module.exports = Queue;
