package com.bank.exception;

public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException(Long accountId) {
        super("Account with id " + accountId + " does not exist");
    }
}
