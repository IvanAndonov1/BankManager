package com.bank.dto;

import java.math.BigDecimal;

public record TransactionDto(Long id, Long accountId, String type,
                             BigDecimal amount, String dateTime, String description) {}
