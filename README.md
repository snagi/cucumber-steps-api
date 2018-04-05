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

## Upcoming features
These features are not fully implemented yet.
- XML, FormData and multipart content-type support

These features are yet to be implemented
- handlebars, ejs template engine support
- JSON schema validation for response
- XML schema validation for response



## Gherkin step definitions

A new request client is initialized for each scenario. Any default options set on client are used for all subsequent requests. Any request level options are used for next requests only.

### Initialize a new Request Context

Cucumber Expression: `I request {string} method at {expression} url`

```gherkin
I request "GET" method at "https://httpbin.org/anything" url
I request "POST" method at "https://httpbin.org/anything" url
I request "OPTIONS" method at "https://httpbin.org/anything" url
```

##### RegExp: `/I request (GET|POST|PUT|PATCH|DEL|DELETE|HEAD|OPTIONS|LINK) method at "([^"]+)" url/`

```gherkin
I request GET method at "https://httpbin.org/anything" url
I request POST method at "https://httpbin.org/anything" url
I request PUT method at "${ENV_NAME_FOR_URL}" url
```

##### RegExp: `/(?:\w|\s|[-_])+ is available at "([^"]+)" url/`

```gherkin
API is available at "https://httpbin.org/anything" url
Service is available at "https://httpbin.org/anything" url
Any String Here is available at "${ENV_NAME_FOR_URL}" url
```

### Set request options

##### RegExp: `/I set "([^"]+)" header as "([^"]+)"/`

```gherkin
I set "some-name" header as "some-value"
I set "other-name" header as "${some-variable}"
I set "Content-Type" header as "json"
I set "Accept" header as "application/json"
```

##### RegExp: `/I set headers(?: as):/`

```gherkin
I set headers:
  | some-name  | some-value  |
  | some-other | other-value |
I set headers as:
  | some-name  | some-value  |
  | some-other | other-value |
```

##### RegExp: `/I set "([^"]+)" query param as "([^"]+)"/`

```gherkin
I set "some-name" query param as "some-value"
I set "other-name" query param as "${some-variable}"
```

##### RegExp: `/I set query params as "([^"]+)"/`

```gherkin
I set query params as "some-name=${some-variable-value}&other-name=other-uri-encoded-value"
```

##### RegExp: `/I set query params(?: as):/`

```gherkin
I set query params:
  | some-name  | some-value  |
  | some-other | other-value |
I set query params as:
  | some-name  | some-value  |
  | some-other | other-value |
```

### Set request body

Set body using content, text, content template, data table or template files. Setting body for GET or HEAD method has no effect, the body will be ignored for GET and HEAD method.

##### RegExp: `/I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body to '([^']+)'/`

Set request body using provided text content and optionally set content-type for request.

```gherkin
I set request body to 'some text here'
I set JSON request body to '{"name":"value","other":"value"}'
I set XML request body to '<request><name>value</name><other>value</other></request>'
I set form request body to 'name=value&other=uriencodedvalue'
```

##### RegExp: `/I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body with content:$/`

Set request body using provided text content and optionally set content-type for request. Content can not use expression/variable resolvers. Any variable mentioned in content in form of `$somevar` or `${somevar}` will be ignored.

```gherkin
I set request body with content:
  """
  some multiline text here
  some more text here
  """
I set JSON request body with content:
  """
  {
    "name":"value",
    "other":"value"
  }
  """
I set XML request body with content:
  """
  <request>
    <name>value</name>
    <other>value</other>
  </request>
  """
I set form request body with content:
  """
  name=value&other=uriencodedvalue
  """
```

##### RegExp: `/I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body (?:to|as):$/`

Set request body using data table and optionally set content-type for request. The data table follows two column structure with first column having key and second column having value. Data table can not use expression/variable resolvers.

```gherkin
I set request body to:
  | some-name | some-value |
  | other     | value      |
I set JSON request body as:
  | some-name | some-value |
  | other     | value      |
```

##### RegExp: `/I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from "([^"]+)"(?: file)?$/`

Set request body using content from a file and optionally set content-type for request.

```gherkin
I set request body from "sample.json" file
I set JSON request body from "sample.json"
I set XML request body from "sample.xml"
```

##### RegExp: `/I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from ?(JS|js)? template content:$/`

Set request body using provided template and optionally set content-type for request. If template type is not specified then default value is `js`.

```gherkin
I set request body from template content:
  """
  {
    id: options.guid(),
    otherId: options.uuid.v4(),
    name: options.faker.name.findName(),
    address: options.chance.address()
  }
  """
I set JSON request body from JS template content:
  """
  {
    id: options.guid(),
    otherId: options.uuid.v4(),
    name: options.faker.name.findName(),
    address: options.chance.address()
  }
  """
```

##### RegExp: `/I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from "([^"]+)" template$/`

Set request body using a template file and optionally set content-type for request.

```gherkin
I set request body from "sample.js" template
I set JSON request body from "sample.tpl.js" template
```

##### RegExp: `/I set ?(JSON|XML|FormData|json|xml|form|form-data|multipart)? request body from "([^"]+)" template with options(?: as)?:$/`

Set request body using a template file and context for template and optionally set content-type for request. The values defined in data table is available as options object in template.

```gherkin
I set request body from "sample.js" template with options as:
  | param1 | value1 |
  | param2 | value2 |
I set JSON request body from "sample.tpl.js" template with options:
  | param1 | value1 |
  | param2 | value2 |
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

Setting request options for next requests -

```javascript
const { HttpClient } = require('cucumber-steps-api');
const client = new HttpClient();

client
  .url('https://httpbin.org/anything')
  .method('POST')
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
  .timeout({ deadline: 30000, response: 5000 })
  .body({ somekey: 'somevalue' };
```

Send request with body `client.send([body, headers, queries, type, accept])`

```javascript
const { HttpClient } = require('cucumber-steps-api');
const client = new HttpClient();

client
  .url('https://httpbin.org/anything')
  .method('POST')
  .send(
    { somekey: 'somevalue' },
    { headername: 'headervalue', otherheader: 'value' },
    [{ name: 'name1', value: 'value1' }, { name: 'name2', value: 'value2' }],
    'json',
    'json'
  );
```