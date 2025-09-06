package com.bank.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record TransactionDto(Long id, Long accountId, String type,
                             BigDecimal amount, OffsetDateTime dateTime, String description) {}
