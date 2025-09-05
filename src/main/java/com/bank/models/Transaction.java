package com.bank.models;

import com.bank.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Transaction {

    private String id;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDateTime dateTime;
    private String description;

    public Transaction(TransactionType type, BigDecimal amount, String description) {

        //this.id = id;
        this.type = type;
        this.amount = amount;
        this.dateTime = LocalDateTime.now();
        this.description = description;

    }

    public String getId() {
        return id;
    }

    public TransactionType getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public String getDescription() {
        return description;
    }
}
