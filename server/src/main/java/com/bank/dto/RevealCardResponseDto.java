package com.bank.dto;

public record RevealCardResponseDto(
        String cardNumber,
        String holderName,
        String expiration,
        String cvv
) {}
