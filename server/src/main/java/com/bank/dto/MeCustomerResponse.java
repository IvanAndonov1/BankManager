package com.bank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record MeCustomerResponse(
        Long id,
        String username,
        String firstName,
        String lastName,
        String email,
        LocalDate dateOfBirth,
        String phoneNumber,
        String homeAddress,
        String egn,
        String role,
        boolean active,
        OffsetDateTime createdAt,
        List<AccountView> accounts
) {
    public record AccountView(
            Long accountId,
            String accountNumber,
            BigDecimal balance
    ) {}
}
