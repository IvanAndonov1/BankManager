package com.bank.web;

import com.bank.dao.UserDirectoryDao;
import com.bank.dto.CustomerDto;
import com.bank.dto.EmployeeDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.bank.security.SecurityUtil.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserDirectoryDao directoryDao;

    public UserController(UserDirectoryDao directoryDao){
        this.directoryDao = directoryDao;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<?> me () {

        Long id = currentUserId();

        if (id == null) {
            return ResponseEntity.status(401).build();
        }

        if (isCustomer()) {

            CustomerDto dto = directoryDao.findCustomerById(id);
            return dto == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);

        }

        if (isEmployee()) {

            EmployeeDto dto = directoryDao.findEmployeeById(id);
            return dto == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);

        }

        return ResponseEntity.status(403).build();

    }

}
