package com.bank.bdd;

import io.cucumber.spring.ScenarioScope;
import io.restassured.response.Response;
import org.springframework.stereotype.Component;

@Component
@ScenarioScope
public class TestContext {
    public io.restassured.response.Response last;
    public String token;
    public Long lastEmployeeId;
    public Long lastCustomerId;
    public void clear() {
        last = null; token = null; lastEmployeeId = null; lastCustomerId = null;
    }
}
