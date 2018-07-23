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
      And I set "field1" field with value "value1"
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Set multiple form fields using data table
    Given I request POST method at "https://httpbin.org/anything" url
      And I set fields as:
        | field1  | value1 |
        | field2  | value2 |
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Attach a file using local image
    Given I request POST method at "https://httpbin.org/anything" url
      And I attach a file at "./resources/blank.jpg" path with name "photo"
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Attach an image file using base64
    Given I request POST method at "https://httpbin.org/anything" url
      And I add an attachment with name "image" and filename as "pixel.gif" with "R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" base64 data
     When I send the request
     Then I expect last response to have status as "200"

  Scenario: Attach an XML file using utf-8 encoding
    Given I request POST method at "https://httpbin.org/anything" url
      And I add an attachment with name "myxml" and filename as "test.xml" with "utf-8" encoding using content:
      """
      <?xml version="1.0" encoding="UTF-8"?>
      <note>
        <to>Someone</to>
        <from>Me</from>
        <heading>Test Message</heading>
        <body>This is a test message!</body>
      </note>
      """
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