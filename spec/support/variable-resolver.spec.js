const VariableResolver = require('../../support/variable-resolver');

describe('Variable Resolver', () => {
  it('should be an function', () => {
    expect(typeof VariableResolver).toBe('function');
  });

  it('should create an instance of resolver', () => {
    const resolver = new VariableResolver();
    expect(resolver).toBeTruthy();
    expect(typeof resolver).toBe('object');
  });

  describe('Variable Resolver instance', () => {
    let resolver = new VariableResolver();

    beforeEach(() => {
      resolver = new VariableResolver();
    });

    it('should be an object', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver).toBe('object');
    });

    it('should support regestering resolver for namespace', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver.register('somenamespace', {
          name: 'value',
          nested: { nested: 'value' },
        });
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should support defining alias for namespace', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.alias).toBe('function');
      try {
        resolver
          .register('somenamespace', {
            name: 'value',
            nested: { nested: 'value' },
          })
          .alias('somenamespace', 'sns');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });
    it('should support defining alias for namespace before regestering resolver', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.alias).toBe('function');
      try {
        resolver
          .alias('somenamespace', 'sns')
          .register('somenamespace', {
            name: 'value',
            nested: { nested: 'value' },
          });
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });
    it('should error in adding alias name that is already defined as namespace', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.alias).toBe('function');
      try {
        resolver
          .register('somenamespace', {
            name: 'value',
            nested: { nested: 'value' },
          })
          .alias('otherns', 'somenamespace');
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });
    it('should support regestering resolver function', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('uppercase', (key) => key.toUpperCase())
          .alias('uppercase', 'uc');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });
    it('should support regestering resolver object', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('somenamespace', {
            name: 'value',
            nested: { nested: 'value' },
          })
          .alias('somenamespace', 'sns');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should regester resolver in default namespace when namespace is not provided', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register({
            name: 'value',
            nested: { nested: 'value' },
          });

        expect(resolver.resolve('name')).toBe('value');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should support regestering multiple resolver for same namespace', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('somenamespace', {
            name: 'value',
            nested: { nested: 'value' },
          })
          .register('somenamespace', {
            name: 'value',
            other: 'othveralue',
            nested: { test: 'value' },
          })
          .alias('somenamespace', 'sns');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should resolve value of key in namespace', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('somenamespace', {
            name: 'value',
            nested: { nested: 'value' },
          })
          .alias('somenamespace', 'sns');

        expect(resolver.resolve('name', 'somenamespace')).toBe('value');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should resolve value of key in namespace alias', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('somenamespace', {
            name: 'value',
            nested: { nested: 'value' },
          })
          .alias('somenamespace', 'sns');

        expect(resolver.resolve('name', 'sns')).toBe('value');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should lookup value for key in all registered resolver for namespace in reverse order they were registered', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('somenamespace', {
            name: 'value',
            other: 'othervalue',
            nested: { nested: 'value' },
          })
          .register('somenamespace', {
            name: 'secondvalue',
            nested: { test: 'value' },
          })
          .alias('somenamespace', 'sns');

        expect(resolver.resolve('name', 'sns')).toBe('secondvalue');
        expect(resolver.resolve('other', 'sns')).toBe('othervalue');
        expect(resolver.resolve('nested', 'sns').test).toBe('value');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should resolve value as null when key is not found in registered namespace', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('somenamespace', {
            name: 'value',
            nested: { nested: 'value' },
          })
          .alias('somenamespace', 'sns');

        expect(resolver.resolve('other', 'sns')).toBeFalsy();
        expect(resolver.resolve('other')).toBeFalsy();
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should resolve value as null when namespace is not registered', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('somenamespace', {
            name: 'value',
            nested: { nested: 'value' },
          })
          .alias('somenamespace', 'sns');

        expect(resolver.resolve('other', 'unknown')).toBeFalsy();
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should error in registering falsy resolver', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('somenamespace');
        expect('this should not be called').toBeFalsy();
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });

    it('should error in registering resolver other than object and function', () => {
      expect(resolver).toBeTruthy();
      expect(typeof resolver.register).toBe('function');
      try {
        resolver
          .register('somenamespace', 'somestring');
          expect('this should not be called').toBeFalsy();
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });
  });
});
