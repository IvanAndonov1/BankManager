package com.bank.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record EmployeeDto(
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
        OffsetDateTime createdAt
) {}