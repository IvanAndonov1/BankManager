package com.bank.service;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ApiLogService {

    private final NamedParameterJdbcTemplate jdbc;

    public ApiLogService(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void saveLog(String user, String message) {
        String sql = """
            INSERT INTO api_logs(user_name, message)
            VALUES (:user, :message)
        """;
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user", user)
                .addValue("message", message);

        jdbc.update(sql, params);
    }
}

