/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const { Given } = require('cucumber');
const { expect } = require('chai');
const Template = require('../support/template');

const debug = require('debug')('cucumber:steps:object-matcher');

function matchRecursive(matcher, data) {
  return Object.keys(matcher).reduce((matches, key) => {
    if (!matches || !data[key]) {
      return false;
    }

    if (matcher[key] instanceof RegExp) {
      return matcher[key].test(data[key]);
    } else if (typeof matcher[key] === 'object') {
      return matchRecursive(matcher[key], data[key]);
    }
    return matcher[key] === data[key];
  }, true);
}

Given(/expect(?:s)? last response to match with ?(?:\w+)?:$/, function (content) {
  debug('Matchin last response body');
  const lastResponse = this.store.get('last-response');
  const matcher = Template.fromTemplateContent(content, 'js', null, this.generator);
  const match = matchRecursive(matcher, lastResponse.body);
  if (!match) {
    this.attach(
      JSON.stringify(lastResponse.body, null, 2),
      lastResponse.headers['content-type'] || 'application/json'
    );
  }
  expect(match, 'last response body should match spec').to.be.true;
});

Given(/expect(?:s)? last response to match with "([^"]+)" template$/, function (filename) {
  debug('Matchin last response body');
  const lastResponse = this.store.get('last-response');
  const matcher = Template.fromTemplateFile(this.resourceResolver(filename), null, this.generator);
  const match = matchRecursive(matcher, lastResponse.body);
  if (!match) {
    this.attach(
      JSON.stringify(lastResponse.body, null, 2),
      'application/json'
    );
    this.attach(
      JSON.stringify(matcher, null, 2),
      'application/json'
    );
  }
  expect(match, 'last response body should match spec').to.be.true;
});
