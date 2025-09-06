package com.bank;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

@Configuration
public class DbSmoke {
    @Bean
    CommandLineRunner smoke(NamedParameterJdbcTemplate jdbc) {
        return args -> {
            Long cnt = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM customers",
                    new MapSqlParameterSource(),
                    Long.class
            );
            System.out.println("Customers in DB: " + cnt);
        };
    }
}
