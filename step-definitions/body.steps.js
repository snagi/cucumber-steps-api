/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const { defineStep } = require('cucumber');
const { expect } = require('chai');
const debug = require('debug')('cucumber:steps');

const Template = require('../support/template');

function bodyFromFile(filepath) {
  if (filepath.toLowerCase().match(/.json$/)) {
    return fs.readFileSync(filepath).toJSON();
  }
  return fs.readFileSync(filepath).toString();
}

defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body to '([^']+)'/,
  function(type, body) {
    expect(this.client, 'client').to.exist;
    return this.client.type(type).body(body);
  }
);
defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body with content:$/,
  function(type, content) {
    expect(this.client, 'client').to.exist;
    return this.client.type(type).body(content);
  }
);
defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body (?:to|as):$/,
  function(type, dataTable) {
    expect(dataTable, 'data dataTable').to.exist;
    expect(dataTable.rows().length > 0, 'data dataTable length > 0').to.be.true;
    expect(this.client, 'client').to.exist;
    debug(dataTable.rowsHash());
    return this.client.type(type).body(dataTable.rowsHash());
  }
);
defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from "([^"]+)"(?: file)?$/,
  function(type, filename) {
    expect(this.client, 'client').to.exist;
    this.client.type(type);

    const body = bodyFromFile(this.resourceResolver(filename));
    this.attach(typeof body === 'string' ? body : JSON.stringify(body), this.client.$type || 'application/json');

    return this.client.body(body);
  }
);
defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from ?(JS|js)? template content:$/,
  function(type, kind, content) {
    expect(this.client, 'client').to.exist;
    this.client.type(type);

    const body = Template.fromTemplateContent(
      content,
      kind || 'js',
      null,
      this.generator
    );
    this.attach(typeof body === 'string' ? body : JSON.stringify(body), this.client.$type || 'application/json');

    return this.client.body(body);
  }
);
defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from "([^"]+)" template$/,
  function(type, filename) {
    expect(this.client, 'client').to.exist;
    debug({ filename, extension });
    this.client.type(type);

    const body = Template.fromTemplateFile(
      this.resourceResolver(filename),
      null,
      this.generator
    );
    this.attach(typeof body === 'string' ? body : JSON.stringify(body), this.client.$type || 'application/json');

    return this.client.body(body);
  }
);
defineStep(
  /I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from "([^"]+)" template with options(?: as)?:$/,
  function(type, filename, dataTable) {
    expect(this.client, 'client').to.exist;
    debug({ filename, extension });
    this.client.type(type);

    const body = Template.fromTemplateFile(
      this.resourceResolver(filename),
      dataTable.rowsHash(),
      this.generator
    );
    this.attach(typeof body === 'string' ? body : JSON.stringify(body), this.client.$type || 'application/json');

    return this.client.body(body);
  }
);
