package com.bank.web;

import com.bank.dao.UserDirectoryDao;
import com.bank.dto.UpdateCustomerSelfRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;
import java.util.Map;

import static com.bank.security.SecurityUtil.isCustomer;


@RestController
@RequestMapping("/api/customers")
public class CustomerSelfController {

    private final UserDirectoryDao directoryDao;

    public CustomerSelfController(UserDirectoryDao directoryDao) {
        this.directoryDao = directoryDao;
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateSelf(@RequestBody UpdateCustomerSelfRequest req) throws AccessDeniedException {

        if (!isCustomer()) {
            throw new AccessDeniedException("Forbidden!");
        }

        if (req.email() != null && !req.email().contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email"));
        }
        if (req.phoneNumber() != null && req.phoneNumber().length() > 30) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid phoneNumber"));
        }

        String username = currentUsername();

        try {

            int n = directoryDao.updateCustomerSelf(username, req);

            var out = directoryDao.readCustomerForResponseByUsername(username);

            return (out == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(out);

        } catch (EmptyResultDataAccessException notFound) {
            return ResponseEntity.status(404).body(Map.of("error", "Customer not found"));
        } catch (DataIntegrityViolationException dup) {
            return ResponseEntity.status(409).body(Map.of("error", "Duplicate or invalid data"));
        }

    }

    private String currentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

}
