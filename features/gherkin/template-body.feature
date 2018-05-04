Feature: Using templates for sending data for making HTTP request 

  As a developer I would like to POST using templates on 
  some url and get response back.

  Scenario: Use inline js template to POST JSON data to a url
    Given I request POST method at "https://httpbin.org/anything" url
    When I send the request with JSON body from js template content:
      """
      {
        id: options.guid(),
        name: options.faker.name.findName(),

      }
      """
    Then I expect last response to have status as "200"
    And I expect last response to match with:
      """
      {
        "headers": {
          "Content-Type": "application/json",
        },
        "json": {
          "id": options.resolve("${store:last-request.body.id}"),
          "name": options.resolve("${store:last-request.body.name}"),
        },
        "method": "POST",
        "url": "https://httpbin.org/anything"
      }
      """

  Scenario: Use generator functions in inline js template to POST method to send data to a url
    Given I request POST method at "https://httpbin.org/anything" url
    When I send the request with JSON body from js template content:
      """
      {
        id: options.guid(),
        uuidv1: options.uuid.v1(),
        uuidv4: options.uuid.v4(),
        name: options.faker.name.findName(),
        address: {
          line1: options.chance.address(),
          city: options.chance.city()
        }
      }
      """
    Then I expect last response to have status as "200"
    And I expect last response to match with:
      """
      {
        "headers": {
          "Content-Type": "application/json",
        },
        "json": {
          "address": {
            "city": options.resolve("${store:last-request.body.address.city}"),
            "line1": options.resolve("${store:last-request.body.address.line1}")
          },
          "id": options.resolve("${store:last-request.body.id}"),
          "name": options.resolve("${store:last-request.body.name}"),
          "uuidv1": options.resolve("${store:last-request.body.uuidv1}"),
          "uuidv4": options.resolve("${store:last-request.body.uuidv4}")
        },
        "method": "POST",
        "url": "https://httpbin.org/anything"
      }
      """

  Scenario: Use js template file to POST JSON data to a url
  Given I request POST method at "https://httpbin.org/anything" url
    When I send the request with JSON body from "../support/resources/sample-template.js" template
    Then I expect last response to have status as "200"
    And I expect last response to match with:
      """
      {
        "headers": {
          "Content-Type": "application/json",
        },
        "json": {
          "address": {
            "city": options.resolve("${store:last-request.body.address.city}"),
            "line1": options.resolve("${store:last-request.body.address.line1}")
          },
          "id": options.resolve("${store:last-request.body.id}"),
          "name": options.resolve("${store:last-request.body.name}"),
          "uuidv1": options.resolve("${store:last-request.body.uuidv1}"),
          "uuidv4": options.resolve("${store:last-request.body.uuidv4}")
        },
        "method": "POST",
        "url": "https://httpbin.org/anything"
      }
      """