package com.bank.service;

import com.bank.dao.PasswordResetTokenDao;
import com.bank.dao.UserDirectoryDao;
import com.bank.models.Customer;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Random;

@Service
public class PasswordResetService {

    private final PasswordResetTokenDao tokenDao;
    private final UserDirectoryDao userDirectoryDao;
    private final PasswordEncoder encoder;
    private final JavaMailSender mailSender;


    private final Random random = new SecureRandom();

    public PasswordResetService(PasswordResetTokenDao tokenDao,
                                UserDirectoryDao userDirectoryDao,
                                PasswordEncoder encoder,
                                JavaMailSender mailSender) {
        this.tokenDao = tokenDao;
        this.userDirectoryDao = userDirectoryDao;
        this.encoder = encoder;
        this.mailSender = mailSender;
    }

    public void sendResetCode(String email) {
        Customer user = userDirectoryDao.findCustomerByEmail(email);
        if (user == null) {
            return; // не издаваме дали email съществува
        }

        String code = String.format("%06d", random.nextInt(1_000_000));
        OffsetDateTime exp = OffsetDateTime.now().plusMinutes(10);

        tokenDao.create(user.getId(), code, exp);

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("admcredian@gmail.com");
        msg.setTo(user.getEmail()); // имейл на клиента
        msg.setSubject("Password reset code");
        msg.setText("Hello " + user.getFirstName() + ",\n\n" +
                "Your password reset code is: " + code + "\n" +
                "It will expire in 10 minutes.\n\n" +
                "If you did not request this, ignore this email.\n\n" +
                "— BankManager Support");

        mailSender.send(msg);
    }

    public boolean verifyCode(Long userId, String code) {
        return tokenDao.validateCode(userId, code);
    }

    public void resetPassword(Long userId, String code, String newPassword) {
        if (!tokenDao.validateCode(userId, code)) {
            throw new IllegalArgumentException("Invalid or expired reset code");
        }

        String hashed = encoder.encode(newPassword);
        userDirectoryDao.updatePassword(userId, hashed);

        tokenDao.markUsed(userId, code);
    }
}
