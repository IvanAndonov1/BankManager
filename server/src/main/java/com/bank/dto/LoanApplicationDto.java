package com.bank.dto;

import com.bank.enums.LoanApplicationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record LoanApplicationDto(

        Long id,
        Long customerId,
        BigDecimal requestedAmount,
        Integer termMonths,
        LoanApplicationStatus status,
        List<String> reasons,
        LocalDate currentJobStartDate,      // NEW
        BigDecimal netSalary,
        String currency,
        BigDecimal nominalAnnualRate,
        BigDecimal monthlyPayment,
        BigDecimal totalPayable,// NEW
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt

) {}


