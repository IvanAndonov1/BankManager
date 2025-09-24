package com.bank.web;

import com.bank.service.PasswordResetService;
import com.bank.dao.UserDirectoryDao;
import com.bank.models.Customer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final PasswordResetService resetService;
    private final UserDirectoryDao userDao;

    public PasswordResetController(PasswordResetService resetService, UserDirectoryDao userDao) {
        this.resetService = resetService;
        this.userDao = userDao;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email required"));
        }

        resetService.sendResetCode(email);
        return ResponseEntity.ok(Map.of("ok", true, "message", "If the email exists, a code was sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");
        String newPassword = body.get("newPassword");

        if (email == null || code == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing fields"));
        }

        Customer user = userDao.findCustomerByEmail(email);
        if (user == null) {
            return ResponseEntity.ok(Map.of("ok", true)); // fake success, не издаваме дали email съществува
        }

        resetService.resetPassword(user.getId(), code, newPassword);
        return ResponseEntity.ok(Map.of("ok", true, "message", "Password changed successfully"));
    }
}
