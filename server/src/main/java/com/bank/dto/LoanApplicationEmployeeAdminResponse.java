package com.bank.dto;

import com.bank.enums.LoanApplicationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record LoanApplicationEmployeeAdminResponse(
        Long id,
        Long customerId,
        BigDecimal requestedAmount,
        Integer termMonths,
        LoanApplicationStatus status,
        LocalDate currentJobStartDate,
        BigDecimal netSalary,
        String currency,
        BigDecimal nominalAnnualRate,
        BigDecimal monthlyPayment,
        BigDecimal totalPayable,
        String targetAccountNumber,
        Long decidedByUserId,
        OffsetDateTime decidedAt,
        List<String> reasons,
        OffsetDateTime disbursedAt,
        BigDecimal disbursedAmount,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}

