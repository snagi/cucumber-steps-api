/* eslint-disable func-names,prefer-arrow-callback */
const path = require('path');
const debug = require('debug')('cucumber:support:world');
const { Before, After, setWorldConstructor, defineParameterType, Given } = require('cucumber');
const superagent = require('superagent');
const HttpClient = require('./http-client');
const Store = require('./store');
const VariableResolver = require('./variable-resolver');
const Generator = require('./data-generator');

function CustomWorld({ attach, parameters }) {
  this.attach = attach;
  this.parameters = parameters;

  debug('Initializing World instance with new instance of agent, store and client');
  const agent = superagent.agent();
  this.Store = baseline => new Store(baseline);
  const store = this.Store();
  this.store = store;
  this.HttpClient = another => new HttpClient(another || agent, this.store);
  this.agent = agent;
  this.client = this.HttpClient();
  this.resourceResolver = resource => path.resolve(this.currentFeatureFileDir, resource);
  this.variableResolver = new VariableResolver();
  this.variableResolver.register('default', Object.assign({}, process.env));
  this.generator = new Generator(Math.floor(Math.random() * 1000000), this.variableResolver);

  debug('Registering variable resolver using store');
  this.variableResolver.register('store', this.store.resolve.bind(this.store)).alias('s');
}

defineParameterType({
  name: 'expression',
  regexp: [/[^"]+/, /[^']+/, /.*/, /.+/],
  preferForRegexpMatch: false,
  transformer(str) {
    return this.variableResolver.evaluate(str);
  },
});

const CWD = process.cwd();
Before(function (options) {
  this.currentWorkingDir = CWD;
  this.currentFeatureFilePath = path.resolve(CWD, options.sourceLocation.uri);
  this.currentFeatureFileDir = path.dirname(this.currentFeatureFilePath);
  debug(`Running feature file: ${options.sourceLocation.uri} with current working dir: ${CWD}`);

  CustomWorld.call(this, this);
});

After(function (options) {
  if (options.result.status === 'failed' || debug.enabled) {
    this.attach('Store dump:');
    this.attach(JSON.stringify(this.store.dump(), null, 2), 'application/json');
  }
});

module.exports = CustomWorld;
