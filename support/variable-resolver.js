const debug = require('debug')('cucumber:support:resolver');

function findFirst(resolvers, key) {
  for (let i = 0; i < resolvers.length; i += 1) {
    const value = resolvers[i](key);
    if (value) {
      debug(`variable resolver - resolving key: ${key} as: ${JSON.stringify(value)}`);
      return value;
    }
  }
  return null;
}

class VariableResolver {
  constructor(options) {
    this.options = options;
    this.resolvers = {};
    this.aliases = {};
  }

  alias(namespace, alias) {
    if (Object.prototype.hasOwnProperty.call(this.resolvers, alias)) {
      throw new Error(`Can not add already registered namespace: ${alias} as alias`);
    }
    this.aliases[alias] = namespace.toLowerCase();
    return this;
  }

  register(namespace, resolver) {
    if (typeof namespace !== 'string') {
      resolver = namespace;
      namespace = null;
    }
    const normalizedNamespace = this.normalizeNamespace(namespace);

    if (!resolver) {
      throw new Error();
    }
    if (!this.resolvers[normalizedNamespace]) {
      this.resolvers[normalizedNamespace] = [];
    }
    switch (typeof resolver) {
      case 'object':
        this.resolvers[normalizedNamespace].push(key => resolver[key]);
        break;
      case 'function':
        this.resolvers[normalizedNamespace].push(resolver);
        break;
      default:
        throw new Error('Resolver type not supported');
    }
    return this;
  }

  resolve(key, namespace) {
    debug(`variable resolver - resolving key: ${key} in ${namespace} namespace`);
    return findFirst(
      (this.resolvers[this.normalizeNamespace(namespace)] || []).reverse(),
      key
    );
  }

  evaluate(str) {
    debug(`variable resolver - evaluating expression: ${str}`);
    return str
      ? str
        .split(/((?:\${?(?:(?:\w+?):)?(?:[A-Za-z0-9-_:$.[\]]+))}?)/g)
        .map((expression) => {
          const matches =
              expression &&
              expression.match(/^["']?(?:\${?(?:(\w+?):)?([A-Za-z0-9-_:$.[\]]+?)}?)["']?$/);
          if (matches && matches[2]) {
            const [, namespace, variable] = matches;
            return this.resolve(variable, namespace) || expression;
          }
          return expression;
        })
        .join('')
      : str;
  }

  normalizeNamespace(namespace) {
    let normalized = (namespace && namespace.toLowerCase()) || 'default';
    normalized = this.aliases[normalized] || normalized;
    return normalized;
  }
}

module.exports = VariableResolver;
