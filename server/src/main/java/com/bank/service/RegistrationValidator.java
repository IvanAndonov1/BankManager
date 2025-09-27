package com.bank.service;

import com.bank.dao.UserDirectoryDao;
import com.bank.util.PhoneUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RegistrationValidator {

    private final UserDirectoryDao userDao;

    public RegistrationValidator(UserDirectoryDao userDao) {
        this.userDao = userDao;
    }

    public static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

    public List<String> validateCustomer(String username,
                                         String password,
                                         String email,
                                         String egn,
                                         String phoneNumberRaw) {

        List<String> errors = new ArrayList<>();

        if (isBlank(username)) errors.add("username is required");
        if (isBlank(password)) errors.add("password is required");
        if (isBlank(email))    errors.add("email is required");
        if (isBlank(egn))      errors.add("egn is required");
        if (isBlank(phoneNumberRaw)) errors.add("phoneNumber is required");

        if (!errors.isEmpty()) return errors;

        if (userDao.existsByUsername(username)) {
            errors.add("Customer with this username exists");
        }

        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasDigit = password.matches(".*\\d.*");

        if (!hasUpper || !hasDigit) {
            errors.add("The password must contain at least one uppercase letter and at least one number.");
        }

        if (!email.contains("@")) {
            errors.add("Email must contain '@'");
        } else if (userDao.existsByEmail(email)) {
            errors.add("Customer with this email exists");
        }

        if (!egn.matches("\\d{10}")) {
            errors.add("EGN must be exactly 10 digits");
        } else if (userDao.existsByEgn(egn)) {
            errors.add("Customer with this EGN exists");
        }

        String normalized = PhoneUtil.normalizeBgPhone(phoneNumberRaw);
        if (normalized == null) {
            errors.add("The phone number must start with +359 and 9 digits after it or with 0 and 9 digits");
        } else if (userDao.existsByPhone(normalized)) {
            errors.add("Customer with this phone number exists");
        }

        return errors;
    }

}
