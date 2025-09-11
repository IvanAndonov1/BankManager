package com.bank.dto;

public record RegisterResponseDto(
        Long id,
        String username,
        String email,
        String role
) {}
