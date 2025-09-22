package com.bank.dto;

import java.math.BigDecimal;

public record AccountDto(
        String accountNumber,
        BigDecimal balance
) {}
