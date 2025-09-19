package com.bank.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record CustomerDto(
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
        List<AccountDto> accounts
) {}
