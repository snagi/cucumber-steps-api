const Client = require('../../support/http-client');
const agent = require('superagent').agent();

describe('Http Client', () => {
  it('should be an function', () => {
    expect(typeof Client).toBe('function');
  });

  it('should create an instance of Client', () => {
    const client = new Client(agent);
    expect(typeof client).toBe('object');
  });

  it('should support sending bearer authorization in request', () => {
    const client = new Client(agent);
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .authorization('x.y.z', 'Bearer')
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending authorization in request', () => {
    const client = new Client(agent);
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .authorization('x.y.z')
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending header in request', () => {
    const client = new Client(agent);
    client.defaults.header('defaultheader1', 'value1');
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .header('header1', 'value1')
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending multiple headers using arrays in request', () => {
    const client = new Client(agent);
    client.defaults.headers([
      { name: 'defaultheader1', value: 'value1' },
      { name: 'defaultheader2', value: 'value2' },
    ]);
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .headers([
        { name: 'header1', value: 'value1' },
        { name: 'header2', value: 'value2' },
      ])
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending multiple headers using object in request', () => {
    const client = new Client(agent);
    client.defaults.headers({
      defaultheader1: 'value1',
      defaultheader2: 'value2',
    });
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .headers({ header1: 'value1', header2: 'value2' })
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending query param in request', () => {
    const client = new Client(agent);
    client.defaults
      .query(['defaultparam1', 'value1'])
      .query({ name: 'defaultparam2', value: 'value2' })
      .query('defaultparam3=value3');
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .query(['param1', 'value1'])
      .query({ name: 'param2', value: 'value2' })
      .query('param3=value3')
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending list of query params in request', () => {
    const client = new Client(agent);
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .queries([
        ['defaultparam1', 'value1'],
        { name: 'defaultparam2', value: 'value2' },
        'defaultparam3=value3',
      ])
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending accept type in request', () => {
    const client = new Client(agent);
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .accept('json')
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending accept type using header in request', () => {
    const client = new Client(agent);
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .header('accept', 'json')
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending content type using header in request', () => {
    const client = new Client(agent);
    return client
      .url('https://httpbin.org/anything')
      .method('get')
      .header('Content-Type', 'json')
      .send({ test: 'value' })
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending data in request and use default json type', () => {
    const client = new Client(agent);
    return client
      .url('https://httpbin.org/anything')
      .method('post')
      .body({ test: 'value' })
      .send()
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });

  it('should support sending data in request with specified type', () => {
    const client = new Client(agent);
    return client
      .url('https://httpbin.org/anything')
      .method('post')
      .type('json')
      .send({ test: 'value' })
      .then(response => {
        expect(response.status).toBe(200);
      })
      .catch(err => {
        expect(err).toBeFalsy();
      });
  });
});
