package com.bank.dto;

import java.time.LocalDate;

public record PublicUserDto(
        String username,
        String email,
        String role,
        String firstName,
        String lastName,
        LocalDate dateOfBirth,
        String phoneNumber,
        String homeAddress,
        String egn
) {}
