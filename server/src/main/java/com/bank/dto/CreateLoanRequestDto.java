package com.bank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateLoanRequestDto(

        Long customerId,
        BigDecimal requestedAmount,
        Integer termMonths,
        LocalDate currentJobStartDate,
        BigDecimal netSalary,
        String targetAccountNumber

) {}
