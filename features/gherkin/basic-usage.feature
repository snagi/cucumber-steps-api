Feature: Basic use cases for making HTTP request 

  As a developer I would like to GET or POST on some url and get response back.

  Scenario: Use GET method to fetch a url
    Given I request GET method at "https://httpbin.org/anything" url
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Use POST method to send JSON data to a url
    Given I request POST method at "https://httpbin.org/anything" url
    When I send the request with JSON body as:
      | param1 | value1 |
      | param2 | value2 |
    Then I expect last response to have status as "200"