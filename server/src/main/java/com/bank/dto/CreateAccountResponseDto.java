package com.bank.dto;

import java.math.BigDecimal;

public record CreateAccountResponseDto(
        String accountNumber,
        BigDecimal balance
) {}
