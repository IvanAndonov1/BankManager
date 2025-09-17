package com.bank.service;

import com.bank.dao.BlacklistedTokenDao;
import com.bank.dto.RegisterRequestDto;
import com.bank.dto.RegisterResponseDto;
import com.bank.security.JwtService;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Service
public class AuthService {

    private final BlacklistedTokenDao blacklist;

    private final NamedParameterJdbcTemplate jdbc;
    private final PasswordEncoder encoder;
    private final AccountService accountService;
    private final JwtService jwt;


    public AuthService(NamedParameterJdbcTemplate jdbc, PasswordEncoder encoder, AccountService accountService, BlacklistedTokenDao blacklist, JwtService jwt){

        this.jdbc = jdbc;
        this.encoder = encoder;
        this.accountService = accountService;
        this.blacklist = blacklist;
        this.jwt = jwt;

    }

    @Transactional
    public RegisterResponseDto registerCustomer(RegisterRequestDto req){

    if (req.username() == null || req.password() == null ||
            req.firstName() == null || req.lastName() == null || req.email() == null) {
        throw new IllegalArgumentException("All fields are required");
    }

    String hashed = encoder.encode(req.password());

    Long id = jdbc.queryForObject("""
                INSERT INTO users(name, password, first_name, last_name, email, role, created_at, active,
                date_of_birth, phone_number, home_address, egn
                )
                VALUES (:u, :p, :f, :l, :e, 'CUSTOMER', now(), true,
                :dob, :phone, :addr, :egn)
                RETURNING id
                """,
            new MapSqlParameterSource()
                    .addValue("u", req.username())
                    .addValue("p", hashed)
                    .addValue("f", req.firstName())
                    .addValue("l", req.lastName())
                    .addValue("e", req.email())
                    .addValue("dob", req.dateOfBirth())
                    .addValue("phone", req.phoneNumber())
                    .addValue("addr", req.homeAddress())
                    .addValue("egn", req.egn()),
            Long.class);

        jdbc.update("INSERT INTO customers(id) VALUES(:id)",
                new MapSqlParameterSource().addValue("id", id));

        accountService.createDefaultAccountForCustomer(id);

        return new RegisterResponseDto(
            id,
            req.username(),
                req.email(),
                        "CUSTOMER",
                        req.firstName(),
                        req.lastName(),
                        req.dateOfBirth(),
                        req.phoneNumber(),
                        req.homeAddress(),
                        req.egn()
                        );

}

    @Transactional
    public RegisterResponseDto registerEmployee(RegisterRequestDto req){

        if (req.username() == null || req.password() == null ||
                req.firstName() == null || req.lastName() == null || req.email() == null) {
            throw new IllegalArgumentException("All fields are required");
        }

        String hashed = encoder.encode(req.password());

        Long id = jdbc.queryForObject("""
                INSERT INTO users(name, password, first_name, last_name, email, role, created_at, active,
                date_of_birth, phone_number, home_address, egn
                )
                VALUES (:u, :p, :f, :l, :e, 'EMPLOYEE', now(), true,
                :dob, :phone, :addr, :egn)
                RETURNING id
                """,
                new MapSqlParameterSource()
                        .addValue("u", req.username())
                        .addValue("p", hashed)
                        .addValue("f", req.firstName())
                        .addValue("l", req.lastName())
                        .addValue("e", req.email())
                        .addValue("dob", req.dateOfBirth())
                        .addValue("phone", req.phoneNumber())
                        .addValue("addr", req.homeAddress())
                        .addValue("egn", req.egn()),
                Long.class);

        return new RegisterResponseDto(
                id,
                req.username(),
                req.email(),
                "EMPLOYEE",
                req.firstName(),
                req.lastName(),
                req.dateOfBirth(),
                req.phoneNumber(),
                req.homeAddress(),
                req.egn()
        );

    }

    public Map<String,Object> login(String username, String password){

        if (username == null || password == null) {
            throw new IllegalArgumentException("Username and password are required!");
        }

        Map<String,Object> user;
        try {
            user = jdbc.queryForMap(
                    "SELECT id, name, password, role FROM users WHERE name=:u",
                    new MapSqlParameterSource("u", username)
            );
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid username or password!");
        }

        String stored = String.valueOf(user.get("password"));
        if (!encoder.matches(password, stored)) {
            throw new IllegalArgumentException("Invalid username or password!");
        }

        Long uid = ((Number) user.get("id")).longValue();
        String role = String.valueOf(user.get("role"));
        String token = jwt.generate(uid, username, role);

        return Map.of("id", uid, "username", username, "role", role, "token", token);

    }

    public void logout(String token, Long userId) {
        blacklist.blacklist(token, userId);
    }
}
