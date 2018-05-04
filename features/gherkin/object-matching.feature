Feature: Using match spec templates for matching objects with expectations 

  As a developer I would like to match the objects with expected values

  Background: Load variables
    Given Default variable resolver is loaded with JSON content:
      """
      {
        "intValue": 12345,
        "floatValue": 1.2345,
        "stringValue": "some-value",
        "intArray": [1, 2, 3, 4],
        "stringArray": ["first", "second", "third"],
        "objectValue": {
          "name": "some-name",
          "address": {
            "line1": "some line",
            "city": "some city",
            "postcode": "AB1 1XY"
          },
          "array": [1, 2, 3],
          "objArray": [{ "a": "a", "b": "b" }, { "a": "b", "b": "a" }, { "a": "c", "b": "d" }]
        },
        "objectArray": [{ "a": "a", "b": "b" }, { "a": "c", "b": "d" }, { "a": "b", "b": "a" }]
      }
      """

  Scenario: Use inline values to match premitive values
    Then I expect "${intValue}" to match "12345"
    And I expect "${intValue}" to not match "2345"
    And I expect "${intValue}" to not match "1.2345"
    And I expect "${intValue}" to not match "some value"
    And I expect "${floatValue}" to match "1.2345"
    And I expect "${floatValue}" to not match "12345"
    And I expect "${stringValue}" to match "some-value"
    And I expect "${stringValue}" to not match "some value"
    And I expect "${stringValue}" to not match "12345"

  Scenario: Use inline js template to match premitive values with regular expressions
    Then I expect "${stringValue}" to match with:
      """
      /\w+/
      """
    And I expect "${stringValue}" to not match with:
      """
      /\d+/
      """
    And I expect "${intValue}" to match with:
      """
      /\d+/
      """
    And I expect "${intValue}" to not match with:
      """
      /[a-zA-Z]+/
      """

  Scenario: Use inline js template to match arrays having out-of-order elements
    Then I expect variable "intArray" to match with:
      """
      [1, 2, 3, 4]
      """
    And I expect variable "intArray" to match with:
      """
      [3, 1, 2, 4]
      """
    And I expect variable "intArray" to not match with:
      """
      [2, 3, 4]
      """
    And I expect variable "intArray" to not match with:
      """
      [5, 1, 2, 4]
      """

  Scenario: Use regular expressions to match premitive arrays elements
    Then I expect variable "intArray" to match with:
      """
      /[1-4]+/
      """
    And I expect variable "intArray" to not match with:
      """
      /[2-5]+/
      """
    And I expect variable "stringArray" to match with:
      """
      /^(first|second|third|fourth)$/
      """
    And I expect variable "stringArray" to not match with:
      """
      /^(second|third|fourth)$/
      """

  Scenario: Use inline js template to match object arrays having out-of-order elements
    Then I expect variable "objectArray" to match with:
      """
      [{ "a": "a", "b": "b" }, { "a": "b", "b": "a" }, { "a": "c", "b": "d" }]
      """
    And I expect variable "objectArray" to match with:
      """
      [{ "a": "b", "b": "a" }, { "a": "a", "b": "b" }, { "a": "c", "b": "d" }]
      """
    And I expect variable "objectArray" to not match with:
      """
      [{ "a": "b", "b": "a" }, { "a": "a", "b": "b", "c": "c" }, { "a": "c", "b": "d" }]
      """
    And I expect variable "objectArray" to not match with:
      """
      [{ "a": "b", "b": "a" }, { "a": "a", "b": "b" }]
      """
    And I expect variable "objectArray" to not match with:
      """
      [{ "a": "b", "b": "a" }, { "a": "a", "b": "b" }, { "a": "c", "b": "d" }, { "a": "d", "b": "c" }]
      """

  Scenario: Use inline js template to match object arrays having out-of-order elements
    Then I expect variable "objectArray" to match with:
      """
      { "a": /a|b|c/, "b": /b|a|d/ }
      """
    And I expect variable "objectArray" to not match with:
      """
      { "a": /a|b|c/, "b": /b|a/ }
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