package com.bank.dto;

import java.math.BigDecimal;

public record AccountDto(Long id, Long customerId, String accountNumber, BigDecimal balance) {}
