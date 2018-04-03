Feature: Set request options

  As a developer I would like to set common HTTP request options 
  like headers and query parameters for next request.

  Scenario: Set a header
    Given I request GET method at "https://httpbin.org/anything" url
      And I set "header1" header as "value1"
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set multiple headers using data table
    Given I request GET method at "https://httpbin.org/anything" url
      And I set headers as:
        | header1 | value1 |
        | header2 | value2 |
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set a query parameter
    Given I request GET method at "https://httpbin.org/anything" url
      And I set "param1" query param as "value1"
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set a query parameters using data table
    Given I request GET method at "https://httpbin.org/anything" url
      And I set query params as "param1=value1&param2=value2"
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set a query parameters using querystring
    Given I request GET method at "https://httpbin.org/anything" url
      And I set query params as:
        | param1 | value1 |
        | param2 | value2 |
     When I send the request
     Then I expect last response to have status as "200"