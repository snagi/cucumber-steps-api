/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const { Given } = require('cucumber');
const { expect } = require('chai');
const Template = require('../support/template');

const debug = require('debug')('cucumber:steps:object-matcher');

function matchRecursive(matcher, data) {
  if (matcher instanceof RegExp) {
    debug(`Matching ${JSON.stringify(data)} with ${matcher.toString()}`);
    return []
      .concat(data)
      .reduce((matches, value) => matches && matcher.test(value), true);
  } else if (Array.isArray(matcher)) {
    const matcherFlags = [];
    const valueFlags = [];
    const matchers = [].concat(matcher);
    const values = [].concat(data);

    if (matchers.length !== values.length) {
      return false;
    }

    for (let i = 0; i < matchers.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (!matcherFlags[i] || !valueFlags[j]) {
          const matches = matchRecursive(matchers[i], values[j]);
          matcherFlags[i] = matcherFlags[i] || matches;
          valueFlags[j] = valueFlags[j] || matches;
        }
      }
    }

    return (
      matcherFlags.reduce((last, current) => last && current, true) &&
      valueFlags.reduce((last, current) => last && current, true)
    );
  } else if (typeof matcher === 'object') {
    return [].concat(data).reduce((matchesItems, item) => {
      return matchesItems && Object.keys(matcher).reduce((matches, key) => {
        if (!matches || !item[key]) {
          return false;
        }
        return matchRecursive(matcher[key], item[key]);
      }, true);
    }, true);
  }
  
  return []
    .concat(data)
    .reduce((matches, value) => matches && matcher === value, true);
}

Given(/expect(?:s)? "([^"]+)" to ?(not)? match "([^"]+)"$/, function(
  value,
  not,
  expected
) {
  debug(`Matching value ${JSON.stringify(value)} with ${JSON.stringify(expected)}`);
  const match = matchRecursive(expected, value);
  if (!match) {
    this.attach(
      JSON.stringify(value, null, 2), 'application/json'
    );
  }
  expect(not ? !match : match, `value should ${not?'not ':''}match with spec`).to.be.true;
});

Given(/expect(?:s)? variable "([^"]+)" to ?(not)? match with ?(?:\w+)?:$/, function(
  variable,
  not,
  content
) {
  const value = this.variableResolver.resolve(variable);
  debug(`Matching value ${JSON.stringify(value)} with spec`);
  const matcher = Template.fromTemplateContent(
    content,
    'js',
    null,
    this.generator
  );
  this.attach(
    JSON.stringify(matcher, null, 2),
    'application/json'
  );
  const match = matchRecursive(matcher, value);
  if (!match) {
    this.attach(
      JSON.stringify(value, null, 2), 'application/json'
    );
  }
  expect(not ? !match : match, `value ${JSON.stringify(value)} should ${not?'not ':''}match with spec ${matcher}`).to.be.true;
});

Given(/expect(?:s)? "([^"]+)" to ?(not)? match with ?(?:\w+)?:$/, function(
  value,
  not,
  content
) {
  debug(`Matching value ${JSON.stringify(value)} with spec`);
  const matcher = Template.fromTemplateContent(
    content,
    'js',
    null,
    this.generator
  );
  this.attach(
    JSON.stringify(matcher, null, 2),
    'application/json'
  );
  const match = matchRecursive(matcher, value);
  if (!match) {
    this.attach(
      JSON.stringify(value, null, 2), 'application/json'
    );
  }
  expect(not ? !match : match, `value ${JSON.stringify(value)} should ${not?'not ':''}match with spec ${matcher}`).to.be.true;
});

Given(/expect(?:s)? last response to ?(not)? match with ?(?:\w+)?:$/, function(
  not,
  content
) {
  debug('Matching last response body');
  const lastResponse = this.store.get('last-response');
  const matcher = Template.fromTemplateContent(
    content,
    'js',
    null,
    this.generator
  );
  this.attach(
    JSON.stringify(matcher, null, 2),
    'application/json'
  );
  const match = matchRecursive(matcher, lastResponse.body);
  if (!match) {
    this.attach(
      JSON.stringify(lastResponse.body, null, 2),
      lastResponse.headers['content-type'] || 'application/json'
    );
  }
  expect(not ? !match : match, `last response body should ${not?'not ':''}match with spec`).to.be.true;
});

Given(/expect(?:s)? last response to ?(not)? match with "([^"]+)" template$/, function(
  not,
  filename
) {
  debug('Matchin last response body');
  const lastResponse = this.store.get('last-response');
  const matcher = Template.fromTemplateFile(
    this.resourceResolver(filename),
    null,
    this.generator
  );
  const match = matchRecursive(matcher, lastResponse.body);
  if (!match) {
    this.attach(JSON.stringify(lastResponse.body, null, 2), 'application/json');
    this.attach(JSON.stringify(matcher, null, 2), 'application/json');
  }
  expect(not ? !match : match, `last response body should ${not?'not ':''}match with spec`).to.be.true;
});
