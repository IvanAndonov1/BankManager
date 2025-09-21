package com.bank.service;

import com.bank.dao.TransactionDao;
import com.bank.dao.LoanApplicationDao;
import com.bank.dto.TransactionDto;
import com.bank.dto.LoanApplicationDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiToolsService {

    private final AccountService accountService;
    private final TransactionDao transactionDao;
    private final LoanApplicationDao loanDao;

    public AiToolsService(AccountService accountService,
                          TransactionDao transactionDao,
                          LoanApplicationDao loanDao) {
        this.accountService = accountService;
        this.transactionDao = transactionDao;
        this.loanDao = loanDao;
    }

    public String getBalance(String accountNumber) {
        var account = accountService.findByAccountNumber(accountNumber);
        if (account == null) {
            return "I could not find an account with number " + accountNumber;
        }
        return "Your account balance is " + account.balance() + " BGN.";
    }

    public String getLastTransactions(String accountNumber, int limit) {
        Long accountId = accountService.findIdByAccountNumber(accountNumber);
        if (accountId == null) {
            return "Account not found for number " + accountNumber;
        }
        var txns = transactionDao.findByAccount(accountId, limit, 0);
        if (txns.isEmpty()) {
            return "You have no recent transactions.";
        }
        return txns.stream()
                .map(t -> t.type() + " " + t.amount() + " on " + t.dateTime() +
                        (t.description() != null ? " (" + t.description() + ")" : ""))
                .collect(Collectors.joining("; "));
    }

    public String getLoans(Long customerId) {
        var loans = loanDao.findByCustomerId(customerId);
        if (loans.isEmpty()) {
            return "You do not have any active loans.";
        }
        return loans.stream()
                .map(l -> "Loan " + l.id() + " of " + l.requestedAmount() + " BGN, status: " + l.status())
                .collect(Collectors.joining("; "));
    }
}
