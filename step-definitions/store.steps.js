/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const jsonPath = require('jsonpath-plus');
const { defineStep } = require('cucumber');
const { expect } = require('chai');
const debug = require('debug')('cucumber:steps');


const LAST_REQUEST = 'last-request';
const LAST_RESPONSE = 'last-response';

defineStep(/I store last request as "([^"]+)"/, function (name) {
  expect(this.store).to.exist;
  this.store.put(name, this.store.get(LAST_REQUEST));
});

defineStep(/I store last response as "([^"]+)"/, function (name) {
  expect(this.store).to.exist;
  this.store.put(name, this.store.get(LAST_RESPONSE));
});

defineStep(/I store value at "([^"]+)" json path in last response as "([^"]+)"/, function (path, name) {
  expect(this.store).to.exist;
  const value = jsonPath({ json: this.store.get(LAST_RESPONSE).body, path });
  this.store.put(name, value && value[0]);
});

defineStep(/I store values at "([^"]+)" json path in last response as "([^"]+)"/, function (path, name) {
  expect(this.store).to.exist;
  const value = jsonPath({ json: this.store.get(LAST_RESPONSE).body, path });
  this.store.put(name, value);
});