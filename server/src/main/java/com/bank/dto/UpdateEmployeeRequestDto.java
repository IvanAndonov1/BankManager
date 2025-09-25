package com.bank.dto;

public record UpdateEmployeeRequestDto(
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String homeAddress,
        Boolean active
) {}
