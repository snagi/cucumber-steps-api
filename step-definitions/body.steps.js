/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const { defineStep } = require('cucumber');
const { expect } = require('chai');
const debug = require('debug')('cucumber:steps');

defineStep(/I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body to '([^']+)'/, function (
  type,
  body
) {
  expect(this.client, 'client').to.exist;
  return this.client.body(body);
});
defineStep(/I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body (?:to|as):/, function (
  type,
  dataTable
) {
  expect(dataTable, 'data dataTable').to.exist;
  expect(dataTable.rows().length > 0, 'data dataTable length > 0').to.be.true;
  expect(this.client, 'client').to.exist;
  debug(dataTable.rowsHash());
  return this.client.body(dataTable.rowsHash());
});
defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from "([^"]+)\.([^"]+)"$/,
  function (type, filename, extension) {
    expect(this.client, 'client').to.exist;
    debug({ filename, extension });
    return this.client.body({ filename, extension });
  }
);
defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from "([^"]+)\.([^"]+)" template$/,
  function (type, filename, extension) {
    expect(this.client, 'client').to.exist;
    debug({ filename, extension });
    return this.client.body({ filename, extension });
  }
);
defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from "([^"]+)\.([^"]+)" template with options(?: as)?:$/,
  function (type, filename, extension, dataTable) {
    expect(this.client, 'client').to.exist;
    debug({ filename, extension });
    return this.client.body({ filename, extension });
  }
);
