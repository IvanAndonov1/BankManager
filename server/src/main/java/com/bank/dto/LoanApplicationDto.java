package com.bank.dto;

import com.bank.enums.LoanApplicationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record LoanApplicationDto(
        Long id,
        Long customerId,
        String productType,
        BigDecimal requestedAmount,
        Integer termMonths,
        LoanApplicationStatus status,
        List<String> reasons,
        LocalDate currentJobStartDate,      // NEW
        BigDecimal netSalary,             // NEW
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}


