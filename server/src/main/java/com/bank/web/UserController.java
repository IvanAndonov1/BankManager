package com.bank.web;

import com.bank.dao.UserDirectoryDao;
import com.bank.dto.CustomerDto;
import com.bank.dto.EmployeeDto;
import com.bank.dto.MeCustomerResponse;
import com.bank.dto.MeEmployeeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.bank.security.SecurityUtil.currentUserId;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserDao users;

    public UserController(UserDao users){
        this.users = users;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> me (Authentication auth){

        Long uid = currentUserId();

        if (uid == null) {
            throw new AuthenticationException("No user id in token!") {};
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
