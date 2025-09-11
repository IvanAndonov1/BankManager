package com.bank.dto;

public record RegisterRequestDto(
        String username,
        String password,
        String firstName,
        String lastName,
        String email
) {}
