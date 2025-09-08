package com.bank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record LoanApplicationDto(
        Long id, Long customerId, String productType,
        java.math.BigDecimal requestedAmount, Integer termMonths,
        String status, java.util.List<String> reasons,
        java.time.LocalDate employerStartDate,      // NEW
        java.math.BigDecimal netSalary,             // NEW
        java.time.OffsetDateTime createdAt, java.time.OffsetDateTime updatedAt
) {}


