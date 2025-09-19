package com.bank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateLoanRequestDto(

        BigDecimal requestedAmount,
        Integer termMonths,
        LocalDate currentJobStartDate,
        BigDecimal netSalary,
        Long targetAccountId

) {}
