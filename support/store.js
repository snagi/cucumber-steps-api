const debug = require('debug')('cucumber:support:store');

let storeCount = 0;
class Store {
  constructor(baseline) {
    this.id = storeCount;
    this.baseline = baseline;
    this.storage = Object.assign({}, baseline || {});
    storeCount += 1;
  }

  clear() {
    debug(`store{${this.id}}: Clearing storage`);
    this.storage = {};
    return this;
  }

  put(key, value) {
    debug(`store{${this.id}}: Storing value for key: ${key}`);
    this.storage[key] = value;
    return this;
  }

  get(key) {
    debug(`store{${this.id}}: Retrieving value for key: ${key}`);
    return this.storage[key];
  }

  resolve(expression) {
    debug(`store{${this.id}}: Retrieving value for expression: ${expression}`);
    const parts = expression.split(/(?:'?\])?\.(?![^'\]]')|'?\]?\['?|'?\]/g);
    return parts
      .slice(1)
      .filter(key => !!key)
      .reduce((last, key) => (last && last[key] ? last[key] : null), this.get(parts[0]));
  }

  dump() {
    return this.storage;
  }
}

module.exports = Store;
