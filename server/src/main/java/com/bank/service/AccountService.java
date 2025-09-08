package com.bank.service;

import com.bank.dao.mapper.AccountDao;
import com.bank.dao.mapper.AccountMapper;
import com.bank.dao.mapper.AccountMapper;
import com.bank.dao.mapper.TransactionDao;
import com.bank.dto.AccountDto;
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
    public void transfer(Long fromId, Long toId, BigDecimal amount, String description) {
        if (fromId.equals(toId)) throw new IllegalArgumentException("Same account");
        withdraw(fromId, amount, "Transfer to " + toId + ": " + description);
        deposit(toId, amount, "Transfer from " + fromId + ": " + description);
    }
}
