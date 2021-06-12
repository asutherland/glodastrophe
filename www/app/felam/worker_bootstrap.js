self.window = self;

// XXX adopt a better solution for logic.js and Maps/Sets
Map.prototype.toJSON = function toJSON() {
  return [...Map.prototype.entries.call(this)];
};

Set.prototype.toJSON = function toJSON() {
  return [...Set.prototype.values.call(this)];
};

console.log('worker requiring worker-setup');
// XXX I think the evaluation of this gets hoisted?
import 'gelam/backend/worker-setup';
console.log('worker required worker-setup');
