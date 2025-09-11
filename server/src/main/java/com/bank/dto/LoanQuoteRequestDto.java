package com.bank.dto;

import java.math.BigDecimal;

public record LoanQuoteRequestDto(

        BigDecimal requestedAmount,
        Integer termMonths

) {}
