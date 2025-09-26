package com.bank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ForecastPointDto(
        LocalDate day,
        BigDecimal inflow,
        BigDecimal outflow,
        BigDecimal net,
        int loansCreated,
        int loansApproved,
        int loansDeclined,
        BigDecimal disbursedAmount,
        double confidence
) {}
