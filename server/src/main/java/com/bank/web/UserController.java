package com.bank.web;

import com.bank.dao.UserDao;
import com.bank.dto.UserProfileDto;
import com.bank.models.User;
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

        User u = users.findById(uid)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: id=" + uid));

        String fullName = ((u.getFirstName() != null ? u.getFirstName() : "") + " " +
                (u.getLastName()  != null ? u.getLastName()  : "")).trim();

        UserProfileDto dto = new UserProfileDto(
                u.getId(),
                u.getUsername(),
                fullName.isEmpty() ? null : fullName,
                u.getEmail(),
                u.getPhoneNumber(),
                u.getHomeAddress(),
                u.getDateOfBirth(),
                u.getEgn(),
                u.getRole().name()
        );

        return ResponseEntity.ok(dto);

    }

}
