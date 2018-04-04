# cucumber-steps-api

[![Build Status](https://travis-ci.org/snagi/cucumber-steps-api.svg?branch=master)](https://travis-ci.org/snagi/cucumber-steps-api)
[![Coverage Status](https://coveralls.io/repos/github/snagi/cucumber-steps-api/badge.svg?branch=master)](https://coveralls.io/github/snagi/cucumber-steps-api?branch=scratchpad)

Cucumber step library for API testing and support functions

## Installation

Install npm module as dev dependency using

```bash
npm install --save-dev cucumber-steps-api
```

If target module is executable test suite then add `cucumber-steps-api` as normal dependency using

```bash
npm install --save cucumber-steps-api
```

## Getting started

Add `cucumber-steps-api` as dependency and require the module to register step definitions.
### Executing cucumber feature tests at commandline

```bash
./node_modules/.bin/cucumber-js features/**/*.feature --require=cucumber-steps-api
```

### Executing cucumber feature tests using gulp-cucumber

Assuming the feature specification are located in `features` directory

```javascript
const gulp = require('gulp');
const cucumber = require('gulp-cucumber');

gulp.src('features/**/*.feature').pipe(
  cucumber({
    steps: ['cucumber-steps-api', `features/**/*.js`],
    format: ['summary', `json:output/json/results-${Date.now()}.json`],
  })
)
```

## Gherkin step definitions

A new request client is initialized for each scenario. Any default options set on client are used for all subsequent requests. Any request level options are used for next requests only.

### Initialize a new Request Context

`I request {string} method at {expression} url`

```gherkin
I request "GET" method at "https://httpbin.org/anything" url
I request "POST" method at "https://httpbin.org/anything" url
I request "OPTIONS" method at "https://httpbin.org/anything" url
```

`I request (GET|POST|PUT|PATCH|DEL|DELETE|HEAD|OPTIONS|LINK) method at "([^"]+)" url`

```gherkin
I request GET method at "https://httpbin.org/anything" url
I request POST method at "https://httpbin.org/anything" url
I request PUT method at "${ENV_NAME_FOR_URL}" url
```

`(?:\w|\s|[-_])+ is available at "([^"]+)" url`

```gherkin
API is available at "https://httpbin.org/anything" url
Service is available at "https://httpbin.org/anything" url
Any String Here is available at "${ENV_NAME_FOR_URL}" url
```

### Set request options

`I set "([^"]+)" header as "([^"]+)"`

```gherkin
I set "some-name" header as "some-value"
I set "other-name" header as "${some-variable}"
I set "Content-Type" header as "json"
I set "Accept" header as "application/json"
```

`I set headers(?: as):`

```gherkin
I set headers:
  | some-name  | some-value  |
  | some-other | other-value |
I set headers as:
  | some-name  | some-value  |
  | some-other | other-value |
```

`I set "([^"]+)" query param as "([^"]+)"`

```gherkin
I set "some-name" query param as "some-value"
I set "other-name" query param as "${some-variable}"
```

`I set query params as "([^"]+)"`

```
I set query params as "some-name=${some-variable-value}&other-name=other-uri-encoded-value"
```

`I set query params(?: as):`

```gherkin
I set query params:
  | some-name  | some-value  |
  | some-other | other-value |
I set query params as:
  | some-name  | some-value  |
  | some-other | other-value |
```

## HttpClient interface

HttpClient provides utility api to formulate request and send to remote server. It internally uses superagent instance.

Setting default request options for all subsequent requests -

```javascript
const { HttpClient } = require('cucumber-steps-api');
const client = new HttpClient();

client
  .defaults()
  .authorization('AAAAAAAA', 'Digest')
  .authorization('x.y.z', 'Bearer')
  .type('json')
  .type('application/json')
  .accept('json')
  .header('accept', 'json')
  .header('name1', 'value1')
  .headers({ name1: 'value1', name2: 'value2' })
  .headers([
    { name: 'name1', value: 'value1' },
    { name: 'name2', value: 'value2' },
  ])
  .query('name1', 'value1')
  .queries(['name1=value1', 'name2=value2'])
  .queries([
    { name: 'name1', value: 'value1' },
    { name: 'name2', value: 'value2' },
  ])
  .queries([['name1', 'value1'], ['name2', 'value2']])
  .key('path/to/key/file')
  .cert('path/to/key/file')
  .ca('path/to/key/file')
  .timeout(30000) // 30 sec in milliseconds
  .timeout({ deadline: 30000, response: 5000 });
```