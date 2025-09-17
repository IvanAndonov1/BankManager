package com.bank.service;

import com.bank.dao.AccountDao;
import com.bank.dao.TransactionDao;
import com.bank.exception.AccountNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AccountService {
    private final AccountDao accountDao;
    private final TransactionDao transactionDao;

    public AccountService(AccountDao accountDao, TransactionDao transactionDao) {
        this.accountDao = accountDao;
        this.transactionDao = transactionDao;
    }

    @Transactional
    public void deposit(Long accountId, BigDecimal amount, String description) {
        if (!accountDao.exists(accountId)) {
            throw new AccountNotFoundException(accountId);
        }

        var balance = accountDao.getBalance(accountId);
        var newBalance = balance.add(amount);
        accountDao.updateBalance(accountId, newBalance);

        transactionDao.insert(accountId, "DEPOSIT", amount, description,"N/A");
    }

    @Transactional
    public void withdraw(Long accountId, BigDecimal amount, String description) {
        if (!accountDao.exists(accountId)) {
            throw new AccountNotFoundException(accountId);
        }

        var balance = accountDao.getBalance(accountId);
        var newBalance = balance.subtract(amount);
        if (newBalance.signum() < 0) throw new IllegalStateException("Insufficient funds");
        accountDao.updateBalance(accountId, newBalance);

        transactionDao.insert(accountId, "WITHDRAW", amount, description,"N/A");
    }

    @Transactional
    public void transfer(Long fromAccountId, Long toAccountId, BigDecimal amount, String description,
                         Long currentUserId, boolean isEmployeeOrAdmin) {
        if (!accountDao.exists(fromAccountId)) {
            throw new AccountNotFoundException(fromAccountId);
        }
        if (!accountDao.exists(toAccountId)) {
            throw new AccountNotFoundException(toAccountId);
        }

        var fromBalance = accountDao.getBalance(fromAccountId);
        var toBalance = accountDao.getBalance(toAccountId);

        if (fromBalance == null) {
            throw new IllegalArgumentException("Source account not found or has no balance");
        }
        if (toBalance == null) {
            throw new IllegalArgumentException("Target account not found or has no balance");
        }
        if(fromBalance.compareTo(amount)<0){
            throw new IllegalArgumentException("Insufficient funds");
        }

        accountDao.updateBalance(fromAccountId, fromBalance.subtract(amount));
        accountDao.updateBalance(toAccountId, toBalance.add(amount));

        transactionDao.insert(fromAccountId, "TRANSFER_OUT", amount, description, "N/A");
        transactionDao.insert(toAccountId, "TRANSFER_IN", amount, description, "N/A");
    }
}
