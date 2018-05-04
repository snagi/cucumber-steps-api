/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const { Given } = require('cucumber');
const { expect } = require('chai');
const debug = require('debug')('cucumber:steps');

Given('reset the client$', function (method, url) {
  this.client = this.HttpClient();
  return this.client.url(url).method(method);
});
Given('I request {string} method at {expression} url', function (method, url) {
  return this.client.url(url).method(method);
});
Given(
  /I request (GET|POST|PUT|PATCH|DEL|DELETE|HEAD|OPTIONS|LINK) method at "([^"]+)" url/,
  function (method, url) {
    return this.client.url(url).method(method);
  }
);
Given(/(?:\w|\s|[-_])+ is available at "([^"]+)" url/, function (url) {
  return this.client.url(url);
});

Given(/I set "([^"]+)" header as "([^"]+)"/, function (name, value) {
  expect(this.client).to.exist;
  return this.client.header(name, value);
});
Given(/I set headers(?: as):/, function (dataTable) {
  expect(dataTable, 'data dataTable').to.exist;
  expect(dataTable.rows().length > 0, 'data dataTable length > 0').to.be.true;
  expect(this.client).to.exist;
  return this.client.headers(dataTable.rowsHash());
});

Given(/I set "([^"]+)" query param as "([^"]+)"/, function (name, value) {
  expect(this.client, 'client').to.exist;
  return this.client.query(`${name}=${encodeURIComponent(value)}`);
});
Given(/I set query params as "([^"]+)"/, function (query) {
  expect(this.client, 'client').to.exist;
  return this.client.query(query);
});
Given(/I set query params(?: as):/, function (dataTable) {
  expect(dataTable, 'data dataTable').to.exist;
  expect(dataTable.rows().length > 0, 'data dataTable length > 0').to.be.true;
  expect(this.client).to.exist;
  return this.client.queries(
    dataTable
      .raw()
      .map(row => [row[0], encodeURIComponent(row[1])])
      .map(row => row.join('='))
  );
});
