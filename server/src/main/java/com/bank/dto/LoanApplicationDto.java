package com.bank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record LoanApplicationDto(
        Long id, Long customerId, String productType,
        BigDecimal requestedAmount, Integer termMonths,
        String status, List<String> reasons,
        LocalDate currentJobStartDate,      // NEW
        BigDecimal netSalary,             // NEW
        OffsetDateTime createdAt, OffsetDateTime updatedAt
) {}


