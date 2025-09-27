package com.bank.service;

import com.bank.dao.BlacklistedTokenDao;
import com.bank.dto.*;
import com.bank.security.JwtService;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AuthService {

    private final BlacklistedTokenDao blacklist;

    private final NamedParameterJdbcTemplate jdbc;
    private final PasswordEncoder encoder;
    private final AccountService accountService;
    private final JwtService jwt;

    private final CardService cardService;


    public AuthService(NamedParameterJdbcTemplate jdbc, PasswordEncoder encoder, AccountService accountService, BlacklistedTokenDao blacklist, JwtService jwt, CardService cardService){

        this.jdbc = jdbc;
        this.encoder = encoder;
        this.accountService = accountService;
        this.blacklist = blacklist;
        this.jwt = jwt;
        this.cardService = cardService;

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

        Long accountId = accountService.createAccount(id);

        String holder = ((req.firstName() == null ? "" : req.firstName()) + " " +
                (req.lastName()  == null ? "" : req.lastName())).trim();

        if (holder.isBlank()) {
            holder = req.username();
        }

        cardService.issuePrimary(accountId, holder);

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
    public RegisterEmployeeResponseDto registerEmployee(RegisterEmployeeRequestDto req){

        if (req.username() == null || req.password() == null ||
                req.firstName() == null || req.lastName() == null || req.email() == null || req.salary() == null) {
            throw new IllegalArgumentException("All fields are required");
        }

        if(req.salary().signum() < 0){
            throw new IllegalArgumentException("Invalid salary (must be >= 0)");
        }

        String hashed = encoder.encode(req.password());

        Long id = jdbc.queryForObject("""
                INSERT INTO users(name, password, first_name, last_name, email, role, created_at, active,
                date_of_birth, phone_number, home_address, egn, salary
                )
                VALUES (:u, :p, :f, :l, :e, 'EMPLOYEE', now(), true,
                :dob, :phone, :addr, :egn, :salary)
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
                        .addValue("egn", req.egn())
                        .addValue("salary", req.salary()),
                Long.class);

            return new RegisterEmployeeResponseDto(
                id,
                req.username(),
                req.email(),
                "EMPLOYEE",
                req.firstName(),
                req.lastName(),
                req.dateOfBirth(),
                req.phoneNumber(),
                req.homeAddress(),
                req.egn(),
                req.salary()
        );

    }

    public AuthLoginResponse login(String username, String password){

        if (username == null || password == null) {
            throw new IllegalArgumentException("Username and password are required!");
        }

        Map<String,Object> user;
        try {

            user = jdbc.queryForMap("""
    SELECT id, name, password, role, active
    FROM users
    WHERE name = :u
    ORDER BY created_at DESC, id DESC
    LIMIT 1
    """,
                    new MapSqlParameterSource("u", username)
            );
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid username or password!");
        }

        Boolean active = (Boolean) user.get("active");
        if (active == null || !active) {
            throw new AccessDeniedException("This account has been deactivated!");
        }

        String stored = String.valueOf(user.get("password"));
        if (!encoder.matches(password, stored)) {
            throw new IllegalArgumentException("Invalid username or password!");
        }

        Long uid = ((Number) user.get("id")).longValue();
        String role = String.valueOf(user.get("role"));
        String token = jwt.generate(uid, username, role);

        return new AuthLoginResponse(username, role, token);

    }

    public void logout(String token, Long userId) {
        blacklist.blacklist(token, userId);
    }
}
