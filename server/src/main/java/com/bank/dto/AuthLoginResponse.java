package com.bank.dto;

public record AuthLoginResponse(
        String username,
        String role,
        String token
) {}
