const mime = require('./mime');
const { parse: urlParser } = require('url');
const debug = require('debug')('cucumber:support:client');

class RequestDefaults {
  constructor(options) {
    const defaults = options || {};
    this.$type = defaults.type;
    this.$accept = defaults.accept;
    this.$authorization = defaults.authorization;

    this.$headers = [].concat(defaults.headers || []);
    this.$queries = [].concat(defaults.queries || []);
  }

  type(type) {
    if (type) {
      this.$type = mime(type);
    }
    return this;
  }

  accept(accept) {
    if (accept) {
      this.$accept = mime(accept);
    }
    return this;
  }

  authorization(authorization) {
    if (authorization) {
      this.$authorization = authorization;
    }
    return this;
  }

  header(name, value) {
    if (name && name.toLowerCase() === 'content-type') {
      this.type(value);
    } else if (name && name.toLowerCase() === 'accept') {
      this.accept(value);
    } else if (name) {
      this.$headers.push({
        name,
        value,
      });
    }
    return this;
  }
  headers(headers) {
    if (headers) {
      const list = Array.isArray(headers)
        ? headers
        : Object.keys(headers).map(key => ({
            name: key,
            value: headers[key],
          }));
      list.forEach(header => this.$header(header.name, header.value));
    }
    return this;
  }

  query(query) {
    if (query) {
      if (typeof query === 'object' && Array.isArray(query)) {
        this.$queries.push([query[0], encodeURIComponent(query[1])].join('='));
      } else if (typeof query === 'object') {
        this.$queries.push(`${query.name}=${encodeURIComponent(query.value)}`);
      } else {
        this.$queries.push(query);
      }
    }
    return this;
  }
  queries(queries) {
    if (queries && queries.length) {
      this.$queries = this.$queries.concat(queries);
    }
    return this;
  }

  key(key) {
    if (key) {
      this.$key = key;
    }
    return this;
  }
  cert(cert) {
    if (cert) {
      this.$cert = cert;
    }
    return this;
  }
  ca(ca) {
    if (ca) {
      this.$ca = ca;
    }
    return this;
  }

  timeout(timeout) {
    if (timeout || timeout === 0) {
      this.$timeout = Number.isNaN(timeout) ? timeout : { deadline: timeout };
    }
  }
}

const GlobalRequestDefaults = new RequestDefaults();
class RequestOptions extends RequestDefaults {
  constructor(options, defaults) {
    options = options || {};
    super(options);
    this.$method = options.method;
    this.$url = options.url;
    this.$defaults = defaults || GlobalRequestDefaults;
  }

  get defaults() {
    return this.$defaults;
  }

  url(url) {
    if (url) {
      this.$url = url;
    }
    return this;
  }

  method(method) {
    if (method) {
      if (
        !method
          .toLowerCase()
          .match(/^(get|post|put|patch|delete|del|link|head|options)$/)
      ) {
        throw new Error(
          `Invalid method: ${method}; Supported methods are get, post, put, patch, delete, del, link, head and options.`
        );
      }
      this.$method = method.toLowerCase();
    }
    return this;
  }

  body(body) {
    if (body) {
      this.$body = body;
    }
    return this;
  }

  dump(kind, wrap) {
    const lines = [];

    const queryString =
      (this.$queries && this.$queries.length) ||
      (this.$defaults.$queries && this.$defaults.$queries.length)
        ? `?${[]
            .concat(this.$defaults.$queries)
            .concat(this.$queries)
            .map(
              query =>
                typeof query === 'object'
                  ? Object.keys(query)
                      .map(key => `${key}=${query[key].toString()}`)
                      .join('&')
                  : query.toString()
            )
            .join('&')}`
        : '';

    const parsedURL = urlParser(this.$url);
    switch (kind) {
      case 'http':
        lines.push(
          `${this.$method.toUpperCase()} ${
            parsedURL.pathname
          }${queryString} HTTP/1.1`
        );
        lines.push(`Host: ${parsedURL.host}`);
        lines.push(`Content-Type: ${this.$type}`);
        lines.push(`Accept: ${this.$accept || this.$type}`);
        this.$headers.forEach(header =>
          lines.push(`${header.name}: ${header.value}`)
        );
        if (!['get', 'head'].includes(this.$method)) {
          lines.push('');
          lines.push(
            typeof this.$body === 'object'
              ? JSON.stringify(this.$body)
              : this.$body.toString()
          );
        }
        break;
      default:
        lines.push(
          `curl -X ${this.$method.toUpperCase()} '${this.$url}${queryString}'${
            wrap ? ' \\' : ''
          }`
        );
        lines.push(`-H 'Content-Type: ${this.$type}'${wrap ? ' \\' : ''}`);
        lines.push(
          `-H 'Accept: ${this.$accept || this.$type}'${wrap ? ' \\' : ''}`
        );
        this.$headers.forEach(header =>
          lines.push(`-H '${header.name}: ${header.value}'${wrap ? ' \\' : ''}`)
        );
        if (!['get', 'head'].includes(this.$method)) {
          lines.push(
            `-d ${
              typeof this.$body === 'object'
                ? JSON.stringify(this.$body)
                : this.$body.toString()
            }`
          );
        }
        break;
    }

    return lines.join(wrap ? '\n' : ' ');
  }
}

let clientCount = 0;
class HttpClient {
  constructor(agent, store) {
    this.id = clientCount;
    this.agent = agent;
    this.store = store;

    this.$defaults = new RequestDefaults({
      type: 'application/json',
    });
    this.$request = new RequestOptions(
      {
        method: 'get',
      },
      this.$defaults
    );

    clientCount += 1;
  }

  get defaults() {
    return this.$defaults;
  }

  url(url) {
    this.$request.url(url);
    return this;
  }
  method(method) {
    this.$request.method(method);
    return this;
  }
  type(type) {
    this.$request.type(type);
    return this;
  }
  accept(accept) {
    this.$request.accept(accept);
    return this;
  }
  authorization(authorization) {
    this.$request.authorization(authorization);
    return this;
  }
  header(name, value) {
    this.$request.header(name, value);
    return this;
  }
  headers(headers) {
    this.$request.headers(headers);
    return this;
  }
  query(query) {
    this.$request.query(query);
    return this;
  }
  queries(queries) {
    this.$request.queries(queries);
    return this;
  }

  body(body) {
    this.$request.body(body);
    return this;
  }

  key(key) {
    this.$request.key(key);
    return this;
  }
  cert(cert) {
    this.$request.cert(cert);
    return this;
  }
  ca(ca) {
    this.$request.ca(ca);
    return this;
  }
  timeout(timeout) {
    this.$request.timeout(timeout);
    return this;
  }

  send(body, headers, queries) {
    const self = this;
    if (body) {
      this.$request.body(body);
    }
    if (headers) {
      this.$request.headers(headers);
    }
    if (queries) {
      this.$request.queries(queries);
    }

    const requestAsCurl = this.request('curl');
    debug(`client{${this.id}} - sending request: ${requestAsCurl}`);
    self.store.put('last-request', {
      url: this.$request.$url,
      method: this.$request.$method,
      body: this.$request.$body,
      curl: requestAsCurl,
    });

    let client = this.agent[this.$request.$method](this.$request.$url);

    if (this.$request.$defaults.$headers && this.$request.$defaults.$headers.length) {
      this.$request.$defaults.$headers.forEach(header => {
        client = client.set(header.name, header.value);
      });
    }
    if (this.$request.$headers && this.$request.$headers.length) {
      this.$request.$headers.forEach(header => {
        client = client.set(header.name, header.value);
      });
    }

    if (this.$request.$defaults.$queries && this.$request.$defaults.$queries.length) {
      this.$request.$defaults.$queries.forEach(query => {
        client = client.query(query);
      });
    }
    if (this.$request.$queries && this.$request.$queries.length) {
      this.$request.$queries.forEach(query => {
        client = client.query(query);
      });
    }

    if (this.$request.$type) {
      client = client.type(this.$request.$type || this.$request.$defaults.$type);
    }
    if (this.$request.$accept) {
      client = client.accept(
        this.$request.$accept ||
          this.$request.$defaults.$accept ||
          this.$request.$type ||
          this.$request.$defaults.$type
      );
    }
    if (this.$request.$key) {
      client = client.key(this.$request.$key || this.$request.$defaults.$key);
    }
    if (this.$request.$cert) {
      client = client.cert(this.$request.$cert || this.$request.$defaults.$cert);
    }
    if (this.$request.$ca) {
      client = client.ca(this.$request.$ca || this.$request.$defaults.$ca);
    }
    if (this.$request.$timeout) {
      client = client.timeout(
        this.$request.$timeout || this.$request.$defaults.$timeout
      );
    }

    if (this.$request.$body && !['get', 'head'].includes(this.$request.$method)) {
      client = client.send(this.$request.$body);
    }

    return client.ok(() => true).then(res => {
      self.response = res;
      self.store.put('last-response', res);
      return Promise.resolve(res);
    });
  }

  request(kind, wrap) {
    return this.$request.dump(kind, wrap);
  }

  response() {
    return this.response;
  }

  get storage() {
    return this.store;
  }
}

module.exports = HttpClient;
