/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const { Given } = require('cucumber');
const debug = require('debug')('cucumber:steps:data-generator');

Given(/set data generator seed to "([^"]+)"$/, function (seed) {
  debug(`Setting data generator seed to ${seed}`);
  this.generator.seed(seed);
});

Given(/reset data generator seed$/, function () {
  debug(`Re-setting data generator seed to ${this.generator.seed}`);
  this.generator.reset();
});
