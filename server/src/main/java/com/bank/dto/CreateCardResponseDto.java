package com.bank.dto;

public record CreateCardResponseDto(
        String maskedNumber,
        String last4,
        String type,
        String expiration,
        String accountNumber
) {}
