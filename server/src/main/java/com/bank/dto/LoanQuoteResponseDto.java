package com.bank.dto;

import java.math.BigDecimal;

public record LoanQuoteResponseDto(

        String currency,
        BigDecimal annualRate,
        BigDecimal monthlyPayment,
        BigDecimal totalPayable,
        BigDecimal requestedAmount,
        Integer termMonths

) {}
