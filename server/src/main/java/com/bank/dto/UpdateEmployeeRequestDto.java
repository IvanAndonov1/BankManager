package com.bank.dto;

import java.math.BigDecimal;

public record UpdateEmployeeRequestDto(
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String homeAddress,
        Boolean active,
        BigDecimal salary
) {}
