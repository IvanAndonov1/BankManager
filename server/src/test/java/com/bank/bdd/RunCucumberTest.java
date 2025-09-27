package com.bank.bdd;

import io.cucumber.junit.platform.engine.Cucumber;
import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

import static io.cucumber.junit.platform.engine.Constants.GLUE_PROPERTY_NAME;
import static io.cucumber.junit.platform.engine.Constants.PLUGIN_PROPERTY_NAME;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("cucumber")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "com.bank.bdd")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME, value = "pretty, summary, html:target/cucumber-report.html, json:target/cucumber.json")
public class RunCucumberTest {
}
