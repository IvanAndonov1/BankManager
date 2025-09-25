package com.bank.dto;

import java.math.BigDecimal;

public record MonthlyForecastDto(
        String periodFrom,
        String periodTo,
        BigDecimal inflow,
        BigDecimal outflow,
        BigDecimal net,
        int loansCreated,
        int loansApproved,
        int loansDeclined,
        BigDecimal disbursedAmount,
        double confidence,
        String analysis
) {}
