package com.bank.web;

import com.bank.dto.RegisterRequestDto;
import com.bank.dto.RegisterResponseDto;
import com.bank.security.JwtService;
import com.bank.security.SecurityUtil;
import com.bank.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final NamedParameterJdbcTemplate jdbc;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final AuthService authService;

    public AuthController(NamedParameterJdbcTemplate jdbc, PasswordEncoder encoder, JwtService jwt, AuthService authService) {
        this.jdbc = jdbc;
        this.encoder = encoder;
        this.jwt = jwt;
        this.authService = authService;
    }

    @PostMapping("/register")
    public RegisterResponseDto register(@RequestBody RegisterRequestDto req) {
        if (req.username() == null || req.password() == null ||
                req.firstName() == null || req.lastName() == null || req.email() == null) {
            throw new IllegalArgumentException("All fields are required");
        }
        String hashed = encoder.encode(req.password());

        Long id = jdbc.queryForObject("""
                INSERT INTO users(name, password, first_name, last_name, email, role, created_at, active)
                VALUES (:u, :p, :f, :l, :e, 'CUSTOMER', now(), true)
                RETURNING id
                """,
                new MapSqlParameterSource()
                        .addValue("u", req.username())
                        .addValue("p", hashed)
                        .addValue("f", req.firstName())
                        .addValue("l", req.lastName())
                        .addValue("e", req.email()),
                Long.class);

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

        Map<String,Object> user;
        try {
            user = jdbc.queryForMap(
                    "SELECT id, name, password, role FROM users WHERE name=:u",
                    new MapSqlParameterSource("u", username)
            );
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String stored = String.valueOf(user.get("password")); // BCrypt hash
        if (!encoder.matches(password, stored)) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        Long uid = ((Number) user.get("id")).longValue();
        String role = String.valueOf(user.get("role"));
        String token = jwt.generate(uid, username, role);

        return Map.of("id", uid, "username", username, "role", role, "token", token);
    }
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing token");
        }
        String token = authHeader.substring(7);
        Long uid = SecurityUtil.currentUserId();
        authService.logout(token, uid);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }


    @GetMapping("/debug/hash")
    public Map<String, String> debugHash(@RequestParam String pw) {
        return Map.of("hash", encoder.encode(pw));
    }

}
