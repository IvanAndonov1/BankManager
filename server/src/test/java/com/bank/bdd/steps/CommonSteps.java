package com.bank.bdd.steps;

import com.bank.bdd.TestContext;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import static org.hamcrest.Matchers.notNullValue;
import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

public class CommonSteps {

    @Autowired private TestContext ctx;

    private String resolvePath(String path) {

        if (ctx.lastEmployeeId != null) {
            path = path.replace("{rememberedId}", String.valueOf(ctx.lastEmployeeId));
        }

        if (ctx.lastCustomerId != null) {
            path = path.replace("{rememberedCustomerId}", String.valueOf(ctx.lastCustomerId));
        }

        return path;
    }

    private RequestSpecification specJson() {

        RequestSpecification s = given().contentType("application/json");

        if (ctx.token != null) {
            s.header("Authorization", "Bearer " + ctx.token);
        }

        return s;
    }

    @When("I GET {string}")
    public void iGET(String path) {
        ctx.last = specJson().get(resolvePath(path));
    }


    @When("I POST {string} with:")
    public void iPOST(String path, DataTable table) {
        Map<String, String> body = new HashMap<>(table.asMap(String.class, String.class));

        if (body.containsKey("email")) {

            String email = body.get("email");
            int at = email.indexOf('@');

            if (at > 0) {

                String unique = email.substring(0, at) + "+" + System.currentTimeMillis() + email.substring(at);
                body.put("email", unique);

            }

        }

        if (body.containsKey("username") && path.startsWith("/api/auth/register/")) {

            String base = body.get("username");
            body.put("username", base + "_" + System.currentTimeMillis());

        }

        ctx.last = specJson().body(body).post(resolvePath(path));
    }


    @When("I PUT {string} with:")
    public void iPUT(String path, DataTable table) {

        Map<String, String> body = table.asMap(String.class, String.class);
        ctx.last = specJson()
                .body(body)
                .put(resolvePath(path));
    }

    @Then("the response status should be {int}")
    public void statusShouldBe(int code) {
        ctx.last.then().statusCode(code);
    }

    @And("I save the JWT token")
    public void saveJwtToken() {

        String token = ctx.last.jsonPath().getString("token");

        if (token == null) {
            throw new AssertionError("Token should be present");
        }

        ctx.token = token;

    }

    @And("the JSON root should be an array")
    public void jsonRootArray() {
        ctx.last.then().body("$", isA(java.util.List.class));
    }

    @And("I remember the employee id from {string}")
    public void rememberEmployeeId(String jsonPath) {

        Long id = ctx.last.jsonPath().getLong(jsonPath.replace("$.", ""));

        if (id == null) {
            throw new AssertionError("Employee id should be present");
        }

        ctx.lastEmployeeId = id;
    }

    @And("the JSON path {string} should not be null")
    public void jsonPathNotNull(String path) {
        ctx.last.then().body(path, notNullValue());
    }
}
