package com.bank.service;

import com.bank.dao.AccountDao;
import com.bank.dao.CardDao;
import com.bank.dto.CardDto;
import com.bank.dto.CardInternalDto;
import com.bank.dto.RevealCardResponseDto;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
public class CardService {

    private final CardDao cardDao;
    private final AccountDao accountDao;
    private final NamedParameterJdbcTemplate jdbc;
    private final PasswordEncoder encoder;

    private final SecureRandom rnd = new SecureRandom();

    public CardService(CardDao cardDao, AccountDao accountDao,
                       NamedParameterJdbcTemplate jdbc, PasswordEncoder encoder) {
        this.cardDao = cardDao;
        this.accountDao = accountDao;
        this.jdbc = jdbc;
        this.encoder = encoder;
    }

    // Генерира 16-цифрен PAN
    private String generatePan() {

        int[] digits = new int[16];
        int[] bin = {5,3,9,9,9,9};

        for (int i=0;i<bin.length;i++) digits[i]=bin[i];
        for (int i=6;i<15;i++) digits[i] = rnd.nextInt(10);

        int sum=0;

        for (int i=0;i<15;i++) {

            int d = digits[14 - i];
            if (i % 2 == 0) {

                d *= 2;
                if (d > 9) d -= 9;

            }

            sum += d;

        }

        digits[15] = (10 - (sum % 10)) % 10;
        StringBuilder pan = new StringBuilder(16);
        for (int d : digits) pan.append(d);
        return pan.toString();

    }

    private String generateCvv() {
        return String.format("%03d", rnd.nextInt(1000));
    }

    public Long issuePrimary(Long accountId, String holderName) {

        // генерираме уникален PAN
        String pan;
        int guard=0;

        do {

            pan = generatePan();
            guard++;

            if (guard>10) {
                throw new IllegalStateException("Cannot generate unique PAN");
            }

        } while (cardDao.existsPan(pan));

        String last4 = pan.substring(pan.length()-4);
        String cvv = generateCvv();
        String publicId = UUID.randomUUID().toString();
        LocalDate exp = LocalDate.now().plusYears(4).withDayOfMonth(1);

        return cardDao.create(accountId, publicId, pan, last4, cvv, exp, "DEBIT", holderName, true);
    }

    public CardInternalDto issueAdditional(String accountNumber,
                                           Long customerId,
                                           String holderName,
                                           String type) {
        // ownership check
        Long accId = accountDao.findIdByAccountNumber(accountNumber);
        if (accId == null) {
            throw new IllegalArgumentException("Account not found");
        }

        Long owner = accountDao.findCustomerIdByAccountNumber(accountNumber);

        if (owner == null || !owner.equals(customerId)) {
            throw new SecurityException("Forbidden");
        }

        String pan;

        int guard = 0;

        do {

            pan = generatePan();
            guard++;

            if (guard > 10) {
                throw new IllegalStateException("Cannot generate unique PAN");
            }

        } while (cardDao.existsPan(pan));

        String last4    = pan.substring(pan.length() - 4);
        String cvv      = generateCvv();
        String publicId = UUID.randomUUID().toString();

        YearMonth expYm = YearMonth.now().plusYears(4);
        LocalDate expDb = expYm.atDay(1);

        String normalizedType = (type == null || type.isBlank()) ? "DEBIT" : type;

        cardDao.create(
                accId,
                publicId,
                pan,
                last4,
                cvv,
                expDb,
                normalizedType,
                holderName,
                false            // допълнителна карта
        );

        return new CardInternalDto(pan, normalizedType, expYm);

    }

    public List<CardDto> listMine(Long customerId) {
        return cardDao.listMine(customerId);
    }

    public List<CardDto> listByAccount(String accountNumber, Long customerId) {
        return cardDao.listByAccountNumber(accountNumber, customerId);
    }

    public RevealCardResponseDto reveal(String publicId, Long customerId, String password) {

        var row = jdbc.queryForMap("SELECT password FROM users WHERE id=:id",
                new MapSqlParameterSource("id", customerId));

        String hashed = String.valueOf(row.get("password"));

        if (password == null || !encoder.matches(password, hashed)) {
            throw new SecurityException("Invalid password");
        }

        var card = cardDao.findByPublicIdForCustomer(publicId, customerId);

        if (card == null) {
            throw new IllegalArgumentException("Card not found");
        }

        if (!"ACTIVE".equals(String.valueOf(card.get("status")))) {
            throw new IllegalStateException("Card is not active");
        }

        return new RevealCardResponseDto(
                String.valueOf(card.get("card_number")),
                String.valueOf(card.get("holder_name")),
                String.valueOf(card.get("expiration")),
                String.valueOf(card.get("cvv"))
        );
    }

    public void block(String publicId, Long customerId) {

        int n = cardDao.block(publicId, customerId);

        if (n != 1) {
            throw new IllegalArgumentException("Cannot block card");
        }

    }

    public void unblock(String publicId, Long customerId) {

        int n = cardDao.unblock(publicId, customerId);

        if (n != 1) {
            throw new IllegalArgumentException("Cannot unblock card (not found or not blocked).");
        }

    }

}
