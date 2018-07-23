/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const { Given } = require('cucumber');
const { expect } = require('chai');
const debug = require('debug')('cucumber:steps');

Given(/reset the client$/, function() {
  this.client = this.HttpClient();
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

Given(/I set "([^"]+)" field (?:with value|as) "([^"]+)"/, function (name, value) {
  expect(this.client).to.exist;
  return this.client.field(name, value);
});
Given(/I set "([^"]+)" field (?:with content|as):/, function (name, content) {
  expect(this.client).to.exist;
  return this.client.field(name, content);
});
Given(/I set fields(?: as):/, function (dataTable) {
  expect(dataTable, 'data dataTable').to.exist;
  expect(dataTable.rows().length > 0, 'data dataTable length > 0').to.be.true;
  expect(this.client).to.exist;
  const fields = dataTable.raw().map(row => ({ name: row[0], value: row[1] }));
  return fields.forEach(field => this.client.field(field));
});

Given(/I attach a|the file at "([^"]+)"(?: path) with name "([^"]+)"/, function (path, name) {
  expect(this.client).to.exist;
  return this.client.attach({ name, path });
});
Given(/I add an attachment with name "([^"]+)" and|having filename(?: as)? "([^"]+)" with|using "([^"]+)"(?:( base64)? data)/, function (name, filename, data, isBase64) {
  expect(this.client).to.exist;
  return this.client.attach({ name, filename, buffer: new Buffer(data, isBase64 ? 'base64' : 'utf8') });
});
Given(/I add an attachment with name "([^"]+)" and|having filename(?: as)? "([^"]+)" using "([^"]+)" buffer(?: with "([^"]+)" encoding)?/, function (name, filename, buffer, encoding) {
  expect(this.client).to.exist;
  return this.client.attach({ name, filename, buffer: new Buffer(buffer, encoding || 'base64') });
});
Given(/I add an attachment with name "([^"]+)" and|having filename(?: as)? with "([^"]+)" encoding)? using content:/, function (name, filename, encoding, content) {
  expect(this.client).to.exist;
  return this.client.attach({ name, filename, buffer: new Buffer(content, encoding || 'utf8') });
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
