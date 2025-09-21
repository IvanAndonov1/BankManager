package com.bank.dto;

public record LoanDecisionsPointDto(
        String day,
        Integer created,
        Integer approved,
        Integer declined
) {}
