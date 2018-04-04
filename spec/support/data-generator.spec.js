const Generator = require('../../support/data-generator');

describe('Data Generator', () => {
  it('should be an function', () => {
    expect(typeof Generator).toBe('function');
  });

  it('should have a default generator intialized', () => {
    expect(Generator.generator).toBeTruthy();
    expect(typeof Generator.generator).toBe('object');
  });

  it('should create a new instance of Generator with random seed', () => {
    const generator = new Generator();
    expect(generator).toBeTruthy();
    expect(typeof generator).toBe('object');
  });

  it('should create a new instance of Generator with specific seed', () => {
    const generator = new Generator(123456);
    expect(generator).toBeTruthy();
    expect(typeof generator).toBe('object');
  });

  describe('Generator instance', () => {
    let generator;
    beforeEach(() => {
      generator = new Generator(123456);
    });

    it('should have generator functions', () => {
      expect(generator).toBeTruthy();
      expect(typeof generator).toBe('object');
      expect(typeof generator.guid).toBe('function');
      expect(typeof generator.uuid).toBe('function');
      expect(typeof generator.uuid.v1).toBe('function');
      expect(typeof generator.uuid.v4).toBe('function');
      expect(typeof generator.faker).toBe('object');
      expect(typeof generator.chance).toBe('object');
    });

    it('should generate random values', () => {
      expect(generator).toBeTruthy();
      expect(generator.guid()).toBeTruthy();
      expect(generator.uuid.v1()).toBeTruthy();
      expect(generator.uuid.v4()).toBeTruthy();
      expect(generator.uuid.v4()).toBeTruthy();
      expect(generator.faker.name.findName()).toBeTruthy();
      expect(generator.chance.name()).toBeTruthy();
      expect(generator.chance.name({ prefix: true, middle: true })).toBeTruthy();
      expect(generator.chance.address()).toBeTruthy();
    });

    it('should generate repeatable random values using same seed for faker and chance generators', () => {
      expect(generator).toBeTruthy();

      generator.seed(12345);
      const fakername1 = generator.faker.name.findName();
      const chancename1 = generator.chance.name({ prefix: true, middle: true });

      generator.seed(12345);
      const fakername2 = generator.faker.name.findName();
      const chancename2 = generator.chance.name({ prefix: true, middle: true });

      expect(fakername1).toEqual(fakername2);
      expect(chancename1).toEqual(chancename2);
    });

    it('should generate repeatable values after resetting seed', () => {
      expect(generator).toBeTruthy();

      generator.seed();
      const fakername1 = generator.faker.name.findName();
      const chancename1 = generator.chance.name({ prefix: true, middle: true });

      generator.reset();
      const fakername2 = generator.faker.name.findName();
      const chancename2 = generator.chance.name({ prefix: true, middle: true });

      expect(fakername1).toEqual(fakername2);
      expect(chancename1).toEqual(chancename2);
    });
  });
});
