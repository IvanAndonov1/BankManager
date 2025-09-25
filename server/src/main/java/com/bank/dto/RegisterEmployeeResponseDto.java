package com.bank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegisterEmployeeResponseDto(
        Long id,
        String username,
        String email,
        String role,
        String firstName,
        String lastName,
        LocalDate dateOfBirth,
        String phoneNumber,
        String homeAddress,
        String egn,
        BigDecimal salary
) {}
