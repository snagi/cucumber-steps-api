Feature: Using templates for sending data for making HTTP request 

  As a developer I would like to POST using templates on 
  some url and get response back.

  Scenario: Use GET method to fetch a url
    Given I request GET method at "https://httpbin.org/anything" url
     When I send the request with JSON body from js template content:
      """
      {
        id: options.guid(),
        name: options.faker.name.findName()
      }
      """
     Then I expect last response to have status as "200"
