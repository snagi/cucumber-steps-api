/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const fs = require('fs');
const requireDir = require('require-dir');
const { Given } = require('cucumber');
const { expect } = require('chai');
const debug = require('debug')('cucumber:steps:variable-resolver');

Given(/(\w+) variable resolver ?(?:having alias (\w+))? is loaded with:$/, function (
  namespace,
  alias,
  dataTable
) {
  const hash = dataTable.rowsHash();
  expect(Object.keys(hash).length > 0, 'data table should have atleast one row').to.be.true;
  debug(`Registering variable resolver for ${namespace} namespace`);
  this.variableResolver.register(namespace, hash);
  if (alias) {
    debug(`Registering variable resolver alias ${alias} for ${namespace} namespace`);
    this.variableResolver.alias(namespace, alias);
  }
});

Given(/(\w+) variable resolver ?(?:having alias (\w+))? is loaded with JSON ?(?:content)?:$/, function (
  namespace,
  alias,
  content
) {
  const hash = JSON.parse(content);
  expect(Object.keys(hash).length > 0, 'data table should have atleast one row').to.be.true;
  debug(`Registering variable resolver for ${namespace} namespace`);
  this.variableResolver.register(namespace, hash);
  if (alias) {
    debug(`Registering variable resolver alias ${alias} for ${namespace} namespace`);
    this.variableResolver.alias(namespace, alias);
  }
});

Given(
  /(\w+) variable resolver ?(?:having alias (\w+))? is loaded with "([^"]+)" (?:file|module)$/,
  function (namespace, alias, filepath) {
    const resolvedPath = this.resourceResolver(filepath);
    expect(fs.existsSync(resolvedPath), `${filepath} should exist`).to.be.true;

    // eslint-disable-next-line global-require,import/no-dynamic-require
    let data = require(resolvedPath);
    if (typeof data === 'function') {
      data = data();
    }

    debug(`Registering variable resolver for ${namespace} namespace`);
    this.variableResolver.register(namespace, data);
    if (alias) {
      debug(`Registering variable resolver alias ${alias} for ${namespace} namespace`);
      this.variableResolver.alias(namespace, alias);
    }
  }
);

Given(
  /(\w+) variable resolver ?(?:having alias (\w+))? is loaded with "([^"]+)" dir$/,
  function (namespace, alias, dirpath) {
    const resolvedPath = this.resourceResolver(dirpath);
    expect(fs.existsSync(resolvedPath), `${dirpath}  should exist`).to.be.true;
    expect(fs.statSync(resolvedPath).isDirectory(), `${dirpath} should be a directory`).to.be.true;

    const data = requireDir(resolvedPath);
    debug(`Registering variable resolver for ${namespace} namespace`);
    this.variableResolver.register(namespace, data);
    if (alias) {
      debug(`Registering variable resolver alias ${alias} for ${namespace} namespace`);
      this.variableResolver.alias(namespace, alias);
    }
  }
);
