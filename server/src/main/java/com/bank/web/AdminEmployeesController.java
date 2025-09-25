package com.bank.web;

import com.bank.dao.UserDirectoryDao;
import com.bank.dto.UpdateEmployeeRequestDto;
import com.bank.models.User;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.bank.security.SecurityUtil.*;

@RestController
@RequestMapping("/api/employees")
public class AdminEmployeesController {

    private final UserDirectoryDao directoryDao;

    public AdminEmployeesController(UserDirectoryDao directoryDao){
        this.directoryDao = directoryDao;
    }

    @PutMapping("/{id}/promote")
    public ResponseEntity<?> promote(@PathVariable Long id) {

        if (!isEmployeeOrAdmin() || isEmployee()) {
            throw new AccessDeniedException("Forbidden!");
        }

        int n = directoryDao.promoteEmployeeToAdmin(id);

        if (n == 0) {
            return ResponseEntity.status(409).body(Map.of(
                    "ok", false,
                    "error", "User is not an active EMPLOYEE or does not exist"
            ));
        }

        var status = directoryDao.readUserStatus(id);
        return ResponseEntity.ok(Map.of(
                "ok", true,
                "id", status.get("id"),
                "username", status.get("username"),
                "role", status.get("role")
        ));

    }

    @PutMapping("/{id}/fire")
    public ResponseEntity<?> fire(@PathVariable Long id) {

        if (!isEmployeeOrAdmin() || isEmployee()) {
            throw new AccessDeniedException("Forbidden!");
        }

        int n = directoryDao.deactivateEmployee(id);

        if (n == 0) {
            return ResponseEntity.status(409).body(Map.of(
                    "ok", false,
                    "error", "User is not an active EMPLOYEE or does not exist"
            ));
        }

        var status = directoryDao.readUserStatus(id);
        return ResponseEntity.ok(Map.of(
                "ok", true,
                "id", status.get("id"),
                "username", status.get("username"),
                "active", status.get("active"),
                "role", status.get("role")
        ));
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateEmployeeByAdmin(@PathVariable Long id, @RequestBody UpdateEmployeeRequestDto req){

        if (!isAdmin()) {
            throw new AccessDeniedException("Forbidden!");
        }

        if (req.email() != null && !req.email().contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email"));
        }

        if (req.phoneNumber() != null && req.phoneNumber().length() > 30) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid phoneNumber"));
        }

        try {

            int n = directoryDao.updateEmployeeByAdmin(id, req);

            if (n == 0) {

                var out = directoryDao.readEmployeeForResponse(id);
                return (out == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(out);

            }

            var out = directoryDao.readEmployeeForResponse(id);
            return (out == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(out);

        } catch (EmptyResultDataAccessException notFound) {
            return ResponseEntity.status(404).body(Map.of("error", "Employee not found"));
        } catch (DataIntegrityViolationException dup) {
            return ResponseEntity.status(409).body(Map.of("error", "Duplicate or invalid data"));
        }

    }

}
