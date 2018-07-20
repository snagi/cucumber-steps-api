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

Given(/I set a field( as object)? with name "([^"]+)" and value "([^"]+)"/, function (isObject, name, value) {
  expect(this.client).to.exist;
  if (isObject) {
    return this.client.field({ name, value });
  }
  return this.client.field(name, value);
});
Given(/I set fields(?: as):/, function (dataTable) {
  expect(dataTable, 'data dataTable').to.exist;
  expect(dataTable.rows().length > 0, 'data dataTable length > 0').to.be.true;
  expect(this.client).to.exist;
  const fields = dataTable.rows().map(row => ({ name: row[0], value: row[1] }));
  return fields.reduce((client, field) => client.field(field), this.client);
});

Given(/I set an attachment with name "([^"]+)" and path "([^"]+)"/, function (name, path) {
  expect(this.client).to.exist;
  return this.client.attach({ name, path });
});
Given(/I set an attachment with name "([^"]+)" and filename "([^"]+)" and buffer "([^"]+)"/, function (name, filename, buffer) {
  expect(this.client).to.exist;
  return this.client.attach({ name, filename, buffer: new Buffer(buffer, 'base64') });
});
Given(/I set attachments(?: as):/, function (dataTable) {
  expect(dataTable, 'data dataTable').to.exist;
  expect(dataTable.rows().length > 0, 'data dataTable length > 0').to.be.true;
  expect(this.client).to.exist;
  const attachments = dataTable.rows().map(row => ({ name: row[0], filename: row[1], buffer: new Buffer(row[2], 'base64') }));
  return attachments.reduce((client, attachment) => client.attach(attachment), this.client);
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
