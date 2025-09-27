Feature: Auth login

  Scenario: Admin can login successfully
    When I login with username "adminTest" and password "password"
    Then the response status should be 200
    And I save the JWT token
