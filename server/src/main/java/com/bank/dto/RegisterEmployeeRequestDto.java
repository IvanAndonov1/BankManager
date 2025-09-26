package com.bank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegisterEmployeeRequestDto(
        String username,
        String password,
        String firstName,
        String lastName,
        String email,
        LocalDate dateOfBirth,
        String phoneNumber,
        String homeAddress,
        String egn,
        BigDecimal salary
) {}
