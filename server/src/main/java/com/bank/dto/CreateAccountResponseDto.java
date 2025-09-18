package com.bank.dto;

import java.math.BigDecimal;

public record CreateAccountResponseDto(
        Long id,
        String accountNumber,
        BigDecimal balance
) {}
