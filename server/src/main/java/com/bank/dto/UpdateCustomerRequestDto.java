package com.bank.dto;

public record UpdateCustomerRequestDto(
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String homeAddress,
        Boolean active
) {}
