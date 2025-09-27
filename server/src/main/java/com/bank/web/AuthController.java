package com.bank.web;

import com.bank.dto.*;
import com.bank.security.JwtService;
import com.bank.security.SecurityUtil;
import com.bank.service.AuthService;
import com.bank.service.RegistrationValidator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
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
    private final RegistrationValidator registrationValidator;

    public AuthController(PasswordEncoder encoder, AuthService authService, RegistrationValidator registrationValidator) {

        this.encoder = encoder;
        this.authService = authService;
        this.registrationValidator = registrationValidator;

    }

    @PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterRequestDto req) {

        var errors = registrationValidator.validateCustomer(
                req.username(),
                req.password(),
                req.email(),
                req.egn(),
                req.phoneNumber()
        );

        if(!errors.isEmpty()){
            return ResponseEntity.badRequest().body(new ValidationErrorResponse(errors));
        }

        var u = authService.registerCustomer(req);

        var body = new PublicUserDto(
                u.username(),
                u.email(),
                "CUSTOMER",
                u.firstName(),
                u.lastName(),
                u.dateOfBirth(),
                u.phoneNumber(),
                u.homeAddress(),
                u.egn()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(body);

    }

    @PostMapping("/register/employee")
    public RegisterEmployeeResponseDto registerEmployee(@RequestBody RegisterEmployeeRequestDto req){

        if(!SecurityUtil.isAdmin()){
            throw new AccessDeniedException("Only Admin can register employees!");
        }

        return authService.registerEmployee(req);

    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponse> login(@RequestBody LoginRequestDto req) {

        AuthLoginResponse response = authService.login(req.username(), req.password());
        return ResponseEntity.ok(response);

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
