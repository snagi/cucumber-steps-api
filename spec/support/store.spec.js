const Store = require('../../support/store');

describe('Store', () => {
  it('should be an function', () => {
    expect(typeof Store).toBe('function');
  });

  it('should create an instance of store without baseline data', () => {
    const store = new Store();
    expect(typeof store).toBe('object');
    expect(typeof store.put).toBe('function');
    expect(typeof store.get).toBe('function');
    expect(typeof store.clear).toBe('function');
    expect(typeof store.resolve).toBe('function');
    expect(typeof store.dump).toBe('function');
  });

  it('should create an instance of store with baseline data', () => {
    const store = new Store({
      v: 'value',
      a: { b: { c: 'a.b.c' }, d: [{ e: 'a.d.0.e' }, { e: 'a.d.1.e' }] },
    });
    expect(typeof store).toBe('object');
    expect(typeof store.put).toBe('function');
    expect(typeof store.get).toBe('function');
    expect(typeof store.clear).toBe('function');
    expect(typeof store.resolve).toBe('function');
    expect(typeof store.dump).toBe('function');
  });

  it('should return value from baseline', () => {
    const store = new Store({
      v: 'value',
      a: { b: { c: 'a.b.c' }, d: [{ e: 'a.d.0.e' }, { e: 'a.d.1.e' }] },
    });
    expect(store.get('v')).toBe('value');
  });

  it('should return value by put earlier for key', () => {
    const store = new Store({
      v: 'value',
      a: { b: { c: 'a.b.c' }, d: [{ e: 'a.d.0.e' }, { e: 'a.d.1.e' }] },
    });
    store.put('key', 'new-value');
    expect(store.get('key')).toBe('new-value');
  });

  it('should return value overridden by put', () => {
    const store = new Store({
      v: 'value',
      a: { b: { c: 'a.b.c' }, d: [{ e: 'a.d.0.e' }, { e: 'a.d.1.e' }] },
    });
    store.put('v', 'new-value');
    expect(store.get('v')).toBe('new-value');
  });

  it('should return value for expression', () => {
    const store = new Store({
      v: 'value',
      a: { b: { c: 'a.b.c' }, d: [{ e: 'a.d.0.e' }, { e: 'a.d.1.e' }] },
    });
    expect(store.resolve('v')).toBe('value');
    expect(store.resolve('a.b.c')).toBe('a.b.c');
    expect(store.resolve('a.d[0].e')).toBe('a.d.0.e');
    expect(store.resolve('a.d[1].e')).toBe('a.d.1.e');
  });

  it('should not return value for non-existing expression', () => {
    const store = new Store({
      v: 'value',
      a: { b: { c: 'a.b.c' }, d: [{ e: 'a.d.0.e' }, { e: 'a.d.1.e' }] },
    });
    expect(store.resolve('a.b.c.d')).toBeFalsy();
  });

  it('should not return value after clearing store', () => {
    const store = new Store({
      v: 'value',
      a: { b: { c: 'a.b.c' }, d: [{ e: 'a.d.0.e' }, { e: 'a.d.1.e' }] },
    });
    store.clear();
    expect(store.get('v')).toBeFalsy();
  });

  it('should return dump of stored objects', () => {
    const store = new Store({
      v: 'value',
      a: { b: { c: 'a.b.c' }, d: [{ e: 'a.d.0.e' }, { e: 'a.d.1.e' }] },
    });
    store.put('v', 'new-value');
    store.put('key', 'new-value');
    const dump = store.dump();

    expect(typeof dump).toBe('object');
    expect(dump.v).toBe('new-value');
    expect(dump.key).toBe('new-value');
  });
});
