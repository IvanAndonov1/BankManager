package com.bank.dto;

import java.math.BigDecimal;

public record LoanPricingDto (

        BigDecimal annualRate,
        BigDecimal monthlyPayment,
        BigDecimal totalPayable

) {}
