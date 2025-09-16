package com.bank.dto;

import java.math.BigDecimal;

public record TransferRequestDto(
        Long toAccountId,
        BigDecimal amount,
        String description
) {}
