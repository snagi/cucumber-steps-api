Feature: Basic use cases for making HTTP request 

  As a developer I would like to GET or POST on some url and get response back.

  Scenario: Use GET method to fetch a url
    Given I request GET method at "https://httpbin.org/anything" url
      And I set "id" query param as "2172797"
      And I set "appid" query param as "b6907d289e10d714a6e88b30761fae22"
     When I send the request
     Then I expect last response to have status as "200"