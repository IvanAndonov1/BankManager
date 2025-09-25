package com.bank.dto;

public record UpdateCustomerSelfRequest(
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String homeAddress
) {}
