package com.bank.dto;

import java.math.BigDecimal;

public record TransferRequestDto(
        String toAccountNumber,
        BigDecimal amount,
        String description
) {}
