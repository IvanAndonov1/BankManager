package com.bank.web;

import com.bank.dao.AccountDao;
import com.bank.dao.UserDirectoryDao;
import com.bank.dto.MeCustomerResponse;
import com.bank.dto.MeEmployeeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

import static com.bank.security.SecurityUtil.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserDirectoryDao directoryDao;
    private final AccountDao accountDao;

    public UserController(UserDirectoryDao directoryDao, AccountDao accountDao){

        this.directoryDao = directoryDao;
        this.accountDao = accountDao;

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

            var rows = accountDao.findIdNumberBalanceByCustomer(id);

            var accounts = rows.stream()
                    .map(r -> new MeCustomerResponse.AccountView(
                            ((Number) r.get("id")).longValue(),
                            (String) r.get("account_number"),
                            (BigDecimal) r.get("balance")
                    ))
                    .toList();

            var resp = new MeCustomerResponse(
                    dto.id(),
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
                    accounts
            );
            return ResponseEntity.ok(resp);
        }

        if (isEmployee()) {

            var dto = directoryDao.findEmployeeById(id);

            if (dto == null) {
                return ResponseEntity.notFound().build();
            }

            var resp = new MeEmployeeResponse(
                    dto.id(),
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
            return ResponseEntity.ok(resp);
        }

        return ResponseEntity.status(403).build();
    }

}

