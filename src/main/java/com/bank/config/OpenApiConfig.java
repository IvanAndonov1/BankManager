package com.bank.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI baseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BankManager API")
                        .version("v1")
                        .description("MVP endpoints for Accounts and Loans")
                        .contact(new Contact().name("BankManager Team").email("team@example.com")))
                // UI base URL shown in Swagger
                .servers(List.of(new Server().url("http://localhost:8080").description("Local")));
    }

    // Optional: group just your REST endpoints under /api/**
    @Bean
    public GroupedOpenApi apiGroup() {
        return GroupedOpenApi.builder()
                .group("api")
                .pathsToMatch("/api/**")
                .build();
    }
}
