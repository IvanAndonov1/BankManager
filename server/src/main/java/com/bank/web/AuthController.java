package com.bank.web;

import com.bank.dto.RegisterRequestDto;
import com.bank.dto.RegisterResponseDto;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final NamedParameterJdbcTemplate jdbc;

    public AuthController(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostMapping("/register")
    public RegisterResponseDto register(@RequestBody RegisterRequestDto req) {
        if (req.username() == null || req.password() == null ||
                req.firstName() == null || req.lastName() == null || req.email() == null) {
            throw new IllegalArgumentException("All fields are required");
        }

        // Insert into users
        String sql = """
            INSERT INTO users(name, password, first_name, last_name, email, role)
            VALUES (:u, :p, :f, :l, :e, 'CUSTOMER')
            RETURNING id
        """;

        Long id = jdbc.queryForObject(sql, new MapSqlParameterSource()
                .addValue("u", req.username())
                .addValue("p", req.password()) // TODO: hash later
                .addValue("f", req.firstName())
                .addValue("l", req.lastName())
                .addValue("e", req.email()), Long.class);

        // Insert into customers
        jdbc.update("INSERT INTO customers(id) VALUES(:id)",
                new MapSqlParameterSource().addValue("id", id));

        return new RegisterResponseDto(id, req.username(), req.email(), "CUSTOMER");
    }
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            throw new IllegalArgumentException("Username and password are required");
        }

        var sql = "SELECT id, name, password, role FROM users WHERE name=:u";
        var params = new MapSqlParameterSource().addValue("u", username);

        try {
            var user = jdbc.queryForMap(sql, params);

            // compare plain text (TODO: hash later with BCrypt)
            String storedPass = String.valueOf(user.get("password"));
            if (!storedPass.equals(password)) {
                throw new IllegalArgumentException("Invalid credentials");
            }

            return Map.of(
                    "id", user.get("id"),
                    "username", user.get("name"),
                    "role", user.get("role"),
                    "token", "dummy-token" // replace with JWT later
            );

        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid username or password");
        }
    }

}
