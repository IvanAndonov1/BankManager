package com.bank.web;

import com.bank.dao.UserDirectoryDao;
import com.bank.dto.CustomerDto;
import com.bank.dto.EmployeeDto;
import com.bank.dto.MeCustomerResponse;
import com.bank.dto.MeEmployeeResponse;
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

            var dto = directoryDao.findCustomerById(id);

            if (dto == null) {
                return ResponseEntity.notFound().build();
            }

            var response = new MeCustomerResponse(
                    dto.username(),
                    dto.firstName(),
                    dto.lastName(),
                    dto.email(),
                    dto.dateOfBirth(),
                    dto.phoneNumber(),
                    dto.homeAddress(),
                    dto.egn(),
                    dto.role(),
                    dto.active(),
                    dto.createdAt(),
                    dto.accounts().stream()
                            .map(acc -> new MeCustomerResponse.AccountView(
                                    acc.accountNumber(),
                                    acc.balance()
                            ))
                            .toList()
            );

            return ResponseEntity.ok(response);
        }

        if (isEmployee()) {

            var dto = directoryDao.findEmployeeById(id);

            if (dto == null) {
                return ResponseEntity.notFound().build();
            }

            var response = new MeEmployeeResponse(
                    dto.username(),
                    dto.firstName(),
                    dto.lastName(),
                    dto.email(),
                    dto.dateOfBirth(),
                    dto.phoneNumber(),
                    dto.homeAddress(),
                    dto.egn(),
                    dto.role(),
                    dto.active(),
                    dto.createdAt()
            );

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(403).build();
    }

}
