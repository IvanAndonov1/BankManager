package com.bank.dto;

import java.time.LocalDate;

public record UserProfileDto (

    Long id,
    String username,
    String fullName,
    String email,
    String phoneNumber,
    String homeAddress,
    LocalDate dateOfBirth,
    String egn,
    String role


) {}
