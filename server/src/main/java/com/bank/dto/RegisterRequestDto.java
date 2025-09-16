package com.bank.dto;

import java.time.LocalDate;

public record RegisterRequestDto(
        String username,
        String password,
        String firstName,
        String lastName,
        String email,
        LocalDate dateOfBirth,
        String phoneNumber,
        String homeAddress,
        String egn
) {}
