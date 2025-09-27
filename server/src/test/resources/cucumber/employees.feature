Feature: Employees admin operations

  Scenario: Admin lists all employees
    Given I am logged in as admin
    When I GET "/api/employees/all"
    Then the response status should be 200
    And the JSON root should be an array

  Scenario: Admin registers employee with salary and then updates salary
    Given I am logged in as admin
    When I POST "/api/auth/register/employee" with:
      | username    | emp_bdd        |
      | password    | secret123      |
      | firstName   | Emp            |
      | lastName    | Bdd            |
      | email       | emp_bdd@example.com |
      | dateOfBirth | 1990-05-07     |
      | phoneNumber | +359888111222  |
      | homeAddress | Sofia          |
      | egn         | 9005070000     |
      | salary      | 3500.00        |
    Then the response status should be 200
    And I remember the employee id from "$.id"
    When I PUT "/api/employees/{rememberedId}" with:
      | salary | 3800.50 |
    Then the response status should be 200
