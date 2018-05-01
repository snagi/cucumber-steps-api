/* eslint-disable func-names,prefer-arrow-callback,no-unused-expressions */
const fs = require('fs');
const { defineStep } = require('cucumber');
const { expect } = require('chai');
const debug = require('debug')('cucumber:steps');

const Template = require('../support/template');

const LAST_REQUEST = 'last-request';
const LAST_RESPONSE = 'last-response';

function bodyFromFile(filepath) {
  if (filepath.toLowerCase().match(/.json$/)) {
    return fs.readFileSync(filepath).toJSON();
  }
  return fs.readFileSync(filepath).toString();
}

defineStep(
  /I (?:send|(GET|POST|PATCH|PUT|DELETE|DEL|OPTIONS|HEAD|LINK)) ?(?:a|an|the)? ?(JSON|XML|FormData|json|xml|form|form-data|multipart)* request(?: to "([^"]+)")?$/,
  function(method, type, url) {
    expect(this.client).to.exist;
    return this.client
      .url(url)
      .method(method)
      .type(type)
      .send();
  }
);
defineStep(
  /I (?:send|(GET|POST|PATCH|PUT|DELETE|DEL|OPTIONS|HEAD|LINK)) ?(?:a|an|the)? ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request(?: to "([^"]+)")? with headers(?: as)?:$/,
  function(method, type, url, dataTable) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    return this.client
      .url(url)
      .method(method)
      .type(type)
      .headers(dataTable.rowsHash())
      .send();
  }
);
defineStep(
  /I (?:send|(GET|POST|PATCH|PUT|DELETE|DEL|OPTIONS|HEAD|LINK)) ?(?:a|an|the)? ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request(?: to "([^"]+)")? with query params(?: as)?:$/,
  function(method, type, url, dataTable) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    return this.client
      .url(url)
      .method(method)
      .type(type)
      .queries(dataTable.raw().map(row => row.join('=')))
      .send();
  }
);
defineStep(
  /I (?:send|(GET|POST|PATCH|PUT|DELETE|DEL|OPTIONS|HEAD|LINK)) ?(?:a|an|the)? ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request(?: to "([^"]+)")? with query params(?: as)? '([^']+)' and headers(?: as)?:$/,
  function(method, type, url, query, dataTable) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    return this.client
      .url(url)
      .method(method)
      .type(type)
      .query(query)
      .headers(dataTable.rowsHash())
      .send();
  }
);
defineStep(
  /I (?:send|(POST|PATCH|PUT|DELETE|DEL|OPTIONS|LINK)) ?(?:a|an|the)? request(?: to "([^"]+)")? with ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? body(?: as)? '([^']+)'$/,
  function(method, url, type, body) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    return this.client
      .url(url)
      .method(method)
      .type(type)
      .body(body)
      .send();
  }
);
defineStep(
  /I (?:send|(POST|PATCH|PUT|DELETE|DEL|OPTIONS|LINK)) ?(?:a|an|the)? request(?: to "([^"]+)")? with ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? body(?: as)?:$/,
  function(method, url, type, dataTable) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    return this.client
      .url(url)
      .method(method)
      .type(type)
      .body(dataTable.rowsHash())
      .send();
  }
);
defineStep(
  /I (?:send|(POST|PATCH|PUT|DELETE|DEL|OPTIONS|LINK)) ?(?:a|an|the)? request(?: to "([^"]+)")? with ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? content(?: as)?:$/,
  function(method, url, type, content) {
    expect(typeof content).to.equal('string');
    expect(this.client).to.exist;
    return this.client
      .url(url)
      .method(method)
      .type(type)
      .body(content)
      .send();
  }
);
defineStep(
  /I (?:send|(POST|PATCH|PUT|DELETE|DEL|OPTIONS|LINK)) ?(?:a|an|the)? request(?: to "([^"]+)")? with ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? body from "([^"]+)"$/,
  function(method, url, type, filename) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    this.client
      .url(url)
      .method(method)
      .type(type);

    const body = bodyFromFile(this.resourceResolver(filename));
    this.attach(
      typeof body === 'string' ? body : JSON.stringify(body),
      this.client.$type || 'application/json'
    );

    return this.client.body(body).send();
  }
);
defineStep(
  /I (?:send|(POST|PATCH|PUT|DELETE|DEL|OPTIONS|LINK)) ?(?:a|an|the)? request(?: to "([^"]+)")? with ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? body from "([^"]+)" with headers(?: as)?:$/,
  function(method, url, type, filename, dataTable) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    this.client
      .url(url)
      .method(method)
      .type(type)
      .headers(dataTable.rowsHash());

    const body = bodyFromFile(this.resourceResolver(filename));
    this.attach(
      typeof body === 'string' ? body : JSON.stringify(body),
      this.client.$type || 'application/json'
    );

    return this.client.body(body).send();
  }
);
defineStep(
  /I (?:send|(POST|PATCH|PUT|DELETE|DEL|OPTIONS|LINK)) ?(?:a|an|the)? request(?: to "([^"]+)")? with ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? body from "([^"]+)" with query params(?: as)?:$/,
  function(method, url, type, filename, dataTable) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    this.client
      .url(url)
      .method(method)
      .type(type)
      .queries(dataTable.raw().map(row => row.join('=')));

    const body = bodyFromFile(this.resourceResolver(filename));
    this.attach(
      typeof body === 'string' ? body : JSON.stringify(body),
      this.client.$type || 'application/json'
    );

    return this.client.body(body).send();
  }
);
defineStep(
  /I (?:send|(POST|PATCH|PUT|DELETE|DEL|OPTIONS|LINK)) ?(?:a|an|the)? request(?: to "([^"]+)")? with ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? body from ?(JS|js)? template content:$/,
  function(method, url, type, kind, content) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    this.client
      .url(url)
      .method(method)
      .type(type);

    const body = Template.fromTemplateContent(
      content,
      kind || 'js',
      null,
      this.generator
    );
    this.attach(
      typeof body === 'string' ? body : JSON.stringify(body),
      this.client.$type || 'application/json'
    );

    return this.client.body(body).send();
  }
);
defineStep(
  /I (?:send|(POST|PATCH|PUT|DELETE|DEL|OPTIONS|LINK)) ?(?:a|an|the)? request(?: to "([^"]+)")? with ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? body from "([^"]+)" template$/,
  function(method, url, type, filename) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    this.client
      .url(url)
      .method(method)
      .type(type);

    const body = Template.fromTemplateFile(
      this.resourceResolver(filename),
      null,
      this.generator
    );
    this.attach(
      typeof body === 'string' ? body : JSON.stringify(body),
      this.client.$type || 'application/json'
    );

    return this.client.body(body).send();
  }
);
defineStep(
  /I (?:send|(POST|PATCH|PUT|DELETE|DEL|OPTIONS|LINK)) ?(?:a|an|the)? request(?: to "([^"]+)")? with ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? body from "([^"]+)" template with options(?: as)?:$/,
  function(method, url, type, filename, dataTable) {
    expect(typeof dataTable).to.not.equal('function');
    expect(this.client).to.exist;
    this.client
      .url(url)
      .method(method)
      .type(type);

    const body = Template.fromTemplateFile(
      this.resourceResolver(filename),
      dataTable.rowsHash(),
      this.generator
    );
    this.attach(
      typeof body === 'string' ? body : JSON.stringify(body),
      this.client.$type || 'application/json'
    );

    return this.client.body(body).send();
  }
);

defineStep(/I expect last response to have status as "([^"]+)"/, function(
  status
) {
  expect(this.store).to.exist;
  expect(this.store.get(LAST_RESPONSE).status).to.equal(Number(status));
});

defineStep(/I log the response/, function() {
  expect(this.store).to.exist;
  debug(JSON.stringify(this.store.get(LAST_RESPONSE).body));
  this.attach('Response -');
  this.attach(
    JSON.stringify(this.store.get(LAST_RESPONSE).body, null, 2),
    'application/json'
  );
});

defineStep(/I log the request and response/, function() {
  expect(this.store).to.exist;
  debug(JSON.stringify(this.store.get(LAST_REQUEST).body));
  this.attach('Request -');
  this.attach(
    JSON.stringify(this.store.get(LAST_REQUEST).body, null, 2),
    'application/json'
  );
  debug(JSON.stringify(this.store.get(LAST_RESPONSE).body));
  this.attach('Response -');
  this.attach(
    JSON.stringify(this.store.get(LAST_RESPONSE).body, null, 2),
    'application/json'
  );
});
