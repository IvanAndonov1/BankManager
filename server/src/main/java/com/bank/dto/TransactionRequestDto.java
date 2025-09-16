package com.bank.dto;

import java.math.BigDecimal;

public record TransactionRequestDto(
        BigDecimal amount,
        String description
) {}
