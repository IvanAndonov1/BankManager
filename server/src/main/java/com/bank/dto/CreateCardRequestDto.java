package com.bank.dto;

public record CreateCardRequestDto(
        String accountNumber,
        String holderName,
        String type
) {}
