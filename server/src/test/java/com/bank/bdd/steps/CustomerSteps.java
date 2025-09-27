package com.bank.bdd.steps;

import com.bank.bdd.TestContext;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import static io.restassured.RestAssured.given;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public class CustomerSteps {

    @Autowired
    private TestContext ctx;

    @Given("a fresh customer registered with username {string} and password {string}")
    public void freshCustomer(String u, String p) {

        String uniqueUsername = u + "_" + System.currentTimeMillis();
        String email = uniqueUsername + "@example.com"; // match username for clarity

        ctx.last = given()
                .contentType("application/json")
                .body(Map.of(
                        "username", uniqueUsername,
                        "password", p,
                        "firstName", "Ivan",
                        "lastName", "Andonov",
                        "email", email
                ))
                .post("/api/auth/register/customer");
    }

}