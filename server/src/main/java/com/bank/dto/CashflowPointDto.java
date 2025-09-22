package com.bank.dto;

import java.math.BigDecimal;

public record CashflowPointDto(
        String day,
        BigDecimal inflow,
        BigDecimal outflow,
        BigDecimal net
) {}
