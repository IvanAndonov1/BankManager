package com.bank.bdd.steps;

import com.bank.bdd.TestContext;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import static io.restassured.RestAssured.given;
import org.springframework.beans.factory.annotation.Autowired;

public class AuthSteps {

    @Autowired private TestContext ctx;

    @When("I login with username {string} and password {string}")
    public void login(String u, String p) {

        ctx.last = given()
                .contentType("application/json")
                .body("{\"username\":\""+u+"\",\"password\":\""+p+"\"}")
                .post("/api/auth/login");

        String token = ctx.last.jsonPath().getString("token");

        if (token == null) {
            throw new AssertionError("Login didn't return a token");
        }

        ctx.token = token;

    }

    @Given("I am logged in as admin")
    public void loginAsAdmin() {
        login("adminTest", "password");
    }

    @Given("I am logged in as customer {string} with password {string}")
    public void loggedInAsCustomer(String u, String p) {
        login(u, p);
    }

}