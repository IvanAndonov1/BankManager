package com.bank.web;

import com.bank.dto.RegisterRequestDto;
import com.bank.dto.RegisterResponseDto;
import com.bank.security.JwtService;
import com.bank.security.SecurityUtil;
import com.bank.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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

    private final PasswordEncoder encoder;
    private final AuthService authService;

    public AuthController(PasswordEncoder encoder, AuthService authService) {

        this.encoder = encoder;
        this.authService = authService;

    }

    @PostMapping("/register/customer")
    public RegisterResponseDto registerCustomer(@RequestBody RegisterRequestDto req) {
        return authService.registerCustomer(req);
    }

    @PostMapping("/register/employee")
    public RegisterResponseDto registerEmployee(@RequestBody RegisterRequestDto req){
        return authService.registerEmployee(req);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        return authService.login(body.get("username"), body.get("password"));
    }

    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing token");
        }

        String token = authHeader.substring(7);

        Long uid = SecurityUtil.currentUserId();
        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired token"));
        }

        authService.logout(token, uid);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));

    }

    @GetMapping("/debug/hash")
    public Map<String, String> debugHash(@RequestParam String pw) {
        return Map.of("hash", encoder.encode(pw));
    }

}
