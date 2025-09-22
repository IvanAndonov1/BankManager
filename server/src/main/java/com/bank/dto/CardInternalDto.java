package com.bank.dto;

import java.time.YearMonth;

public record CardInternalDto(
        String cardNumber,
        String type,
        YearMonth expiration
) {}
