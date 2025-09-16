package com.bank.models;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

// сметка
public class Account {

    private Long id;
    private String accountNumber;
    private BigDecimal balance;
    private Long ownerId;
    private OffsetDateTime createdAt;

    public Account() {
        this.balance = BigDecimal.ZERO;
    }

    public Account(String accountNumber, Long ownerId) {

        this.accountNumber = accountNumber;
        this.ownerId = ownerId;
        this.balance = BigDecimal.ZERO;

    }

    public Account(Long id, String accountNumber, BigDecimal balance, Long ownerId) {

        this.id = id;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.ownerId = ownerId;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

}