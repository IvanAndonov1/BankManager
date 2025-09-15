package com.bank.models;

import com.bank.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

    public class Transaction {

        private Long id;
        private Long accountId;
        private TransactionType type;
        private BigDecimal amount;
        private LocalDateTime dateTime;
        private String description;

        public Transaction(Long accountId, TransactionType type, BigDecimal amount, String description) {

            this.accountId = accountId;
            this.type = type;
            this.amount = amount;
            this.dateTime = LocalDateTime.now();
            this.description = description;

        }

        public Transaction(Long id, Long accountId, TransactionType type, BigDecimal amount, LocalDateTime dateTime, String description) {

            this.id = id;
            this.accountId = accountId;
            this.type = type;
            this.amount = amount;
            this.dateTime = dateTime;
            this.description = description;

        }

        public Long getId() {
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