package com.bank.service;

import com.bank.dao.AccountDao;
import com.bank.dao.TransactionDao;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AccountService {
    private final AccountDao accounts;
    private final TransactionDao txs;

    public AccountService(AccountDao accounts, TransactionDao txs) {
        this.accounts = accounts;
        this.txs = txs;
    }

    @Transactional
    public void deposit(Long accountId, BigDecimal amount, String description) {
        var acc = accounts.findById(accountId).orElseThrow();
        var newBal = acc.balance().add(amount);
        accounts.updateBalance(accountId, newBal);
        txs.create(accountId, "DEPOSIT", amount, description);
    }

    @Transactional
    public void withdraw(Long accountId, BigDecimal amount, String description) {
        var acc = accounts.findById(accountId).orElseThrow();
        var newBal = acc.balance().subtract(amount);
        if (newBal.signum() < 0) throw new IllegalStateException("Insufficient funds");
        accounts.updateBalance(accountId, newBal);
        txs.create(accountId, "WITHDRAW", amount, description);
    }

    @Transactional
    public void transfer(Long fromAccountId, Long toAccountId, BigDecimal amount, String description, Long currentUserId, boolean employeeOrAdmin) {
        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        // ✅ Access control: only employees/admins OR the account owner can send
        if (!employeeOrAdmin) {
            Long ownerId = accounts.findCustomerIdByAccountId(fromAccountId);
            if (ownerId == null || !ownerId.equals(currentUserId)) {
                throw new AccessDeniedException("You are not allowed to transfer from this account");
            }
        }

        // ✅ Check source balance
        BigDecimal fromBalance = accounts.getBalance(fromAccountId);
        if (fromBalance == null) throw new IllegalArgumentException("Source account not found");
        if (fromBalance.compareTo(amount) < 0) throw new IllegalArgumentException("Insufficient funds");

        // ✅ Check destination exists
        BigDecimal toBalance = accounts.getBalance(toAccountId);
        if (toBalance == null) throw new IllegalArgumentException("Destination account not found");

        // ✅ Update balances atomically
        accounts.updateBalance(fromAccountId, fromBalance.subtract(amount));
        accounts.updateBalance(toAccountId, toBalance.add(amount));

        // ✅ Record transactions
        txs.create(fromAccountId, "TRANSFER_OUT", amount.negate(), description);
        txs.create(toAccountId, "TRANSFER_IN", amount, description);
    }
}
