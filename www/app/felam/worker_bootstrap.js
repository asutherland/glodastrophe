define(function(require) {
'use strict';

self.window = self;

// XXX adopt a better solution for logic.js and Maps/Sets
Map.prototype.toJSON = function toJSON() {
  return [...Map.prototype.entries.call(this)];
};

Set.prototype.toJSON = function toJSON() {
  return [...Set.prototype.values.call(this)];
};

console.log('worker requiring worker-setup');
require('gelam/worker-setup');
console.log('worker required worker-setup');
});
