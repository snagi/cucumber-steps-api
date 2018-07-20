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

  Scenario: Set a form field
    Given I request POST method at "https://httpbin.org/anything" url
      And I set a field with name "field1" and value "value1"
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set a form field as object
    Given I request POST method at "https://httpbin.org/anything" url
      And I set a field as object with name "field1" and value "value1"
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set multiple form fields using data table
    Given I request POST method at "https://httpbin.org/anything" url
      And I set fields as:
        | name    | value |
        | field1  | value1 |
        | field2  | value2 |
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set a file attachment as using local image
    Given I request POST method at "https://httpbin.org/anything" url
      And I set an attachment with name "photo" and path "./resources/blank.jpg"
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set a file attachment as using base64 image
    Given I request POST method at "https://httpbin.org/anything" url
      And I set an attachment with name "image" and filename "pixel.gif" and buffer "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set multiple file attachments using data table
    Given I request POST method at "https://httpbin.org/anything" url
      And I set attachments as:
        | name   | filename         | buffer |
        | image1 | black.gif        | data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs= |
        | image2 | transparent.gif  | data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7 |
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Use generator functions in inline js template to POST method to send data to a url
    Given I request GET method at "https://httpbin.org/anything" url
    And I set "header1" header as "value1"
    When I reset the client
    And I set "header2" header as "value2"
    And I GET the request to "https://httpbin.org/anything"
    Then I expect last response to have status as "200"
    And And I expect "${store:last-response.body.headers.Header1}" to not match "value1"
    And And I expect "${store:last-response.body.headers.Header2}" to match "value2"