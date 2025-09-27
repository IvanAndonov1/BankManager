Feature: Customer access restrictions

Scenario: Customer cannot list all customers
  Given I am logged in as customer "cust_bdd" with password "secret123"
  When I GET "/api/customers/all"
  Then the response status should be 403