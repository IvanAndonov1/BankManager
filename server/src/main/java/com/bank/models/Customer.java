package com.bank.models;

import com.bank.enums.Role;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import java.util.Objects;

public class Customer extends User {

   // private Long id;                          // DB PK
    private OffsetDateTime createdAt;         // registered date
    private final List<Account> accountList = new ArrayList<>();

    public Customer(String username, String password, String firstName, String lastName, String email) {
        super(username, password, firstName, lastName, email);
        this.setRole(Role.CUSTOMER);
    }

    public Customer(Long id,
                    String username,
                    String password,
                    String firstName,
                    String lastName,
                    String email,
                    OffsetDateTime createdAt) {
        super(username, password, firstName, lastName, email);
        this.setId(id);
        this.createdAt = createdAt;
        this.setRole(Role.CUSTOMER);
    }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public List<Account> getAccountList() { return accountList; }
    public void addAccount(Account account) {
        if (account != null) accountList.add(account);
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + getId() +
                ", username='" + getUsername() + '\'' +
                ", firstName='" + getFirstName() + '\'' +
                ", lastName='" + getLastName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", createdAt=" + createdAt +
                ", accounts=" + accountList.size() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Customer c)) return false;
        return Objects.equals(getId(), c.getId());
    }

    @Override
    public int hashCode() { return Objects.hash(getId()); }
}