const uuid = require('uuid');
const Faker = require('faker/lib');
const fakerLocales = require('faker/lib/locales');
const Chance = require('chance');

const debug = require('debug')('cucumber:support:generator');

function hashToInteger(value) {
  return Number.parseInt(`0x${value}`, 36) % Number.MAX_SAFE_INTEGER;
}

let generatorCount = 0;
class Generator {
  constructor(seed) {
    this.id = generatorCount;
    this.uuid = uuid;
    this.guid = uuid.v4;
    this.faker = new Faker({ locales: fakerLocales });

    debug(`generator{${this.id}}: Setting data generator seed to ${seed}`);
    this.seed = seed;
    this.seedHash = hashToInteger(seed);
    this.faker.seed(this.seedHash);
    this.chance = new Chance(seed);

    generatorCount += 1;
  }

  seed(seed) {
    debug(`generator{${this.id}}: Setting data generator seed to ${seed}`);
    this.seed = seed;
    this.seedHash = hashToInteger(seed);
    this.faker.seed(this.seedHash);
    this.chance = new Chance(this.seed);
  }

  reset() {
    debug(`generator{${this.id}}: Re-setting data generator seed to ${this.seed}`);
    this.faker.seed(this.seedHash);
    this.chance = new Chance(this.seed);
  }
}

Generator.generator = new Generator(Math.floor(Math.random() * 10000));

module.exports = Generator;
