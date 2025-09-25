package com.bank.service;

import com.bank.dao.TransactionDao;
import com.bank.dao.LoanApplicationDao;
import com.bank.dao.UserDirectoryDao;
import com.bank.dto.CustomerDto;
import com.bank.dto.TransactionDto;
import com.bank.dto.LoanApplicationDto;
import com.bank.service.CardService;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiToolsService {

    private final AccountService accountService;
    private final TransactionDao transactionDao;
    private final LoanApplicationDao loanDao;
    private final CardService cardService;
    private final UserDirectoryDao directoryDao;

    public AiToolsService(AccountService accountService,
                          TransactionDao transactionDao,
                          LoanApplicationDao loanDao,
                          CardService cardService,
                          UserDirectoryDao directoryDao) {
        this.accountService = accountService;
        this.transactionDao = transactionDao;
        this.loanDao = loanDao;
        this.cardService = cardService;
        this.directoryDao = directoryDao;
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
    public String getCreditScore(Long customerId) {
        var loans = loanDao.findByCustomerId(customerId);
        if (loans.isEmpty()) {
            return "You have no loan applications, so no credit score is available.";
        }

        var latest = loans.get(loans.size() - 1);
        var dto = loanDao.findById(latest.id());

        if (dto == null || dto.evaluationComposite() == null) {
            return "Your last loan application has not been evaluated yet.";
        }

        return "Your last evaluation score was "
                + dto.evaluationComposite() + " points. Status: "
                + dto.evaluationStatus()
                + (dto.evaluationReasons() != null && !dto.evaluationReasons().isBlank()
                ? " Reasons: " + dto.evaluationReasons()
                : "");
    }
    public String getLoanApplications(Long customerId) {
        var loans = loanDao.findByCustomerId(customerId);
        if (loans.isEmpty()) {
            return "You have no loan applications.";
        }
        return loans.stream()
                .map(l -> "Application " + l.id() + " for " + l.requestedAmount() + " BGN, status: " + l.status())
                .collect(Collectors.joining("; "));
    }

    public String getLatePayments(Long customerId) {
        boolean late = loanDao.hasLateInLast12Months(customerId);
        return late
                ? "Yes, you had at least 1 late payment in the past 12 months."
                : "No late payments detected in the past 12 months.";
    }

    public String getAnalyticsOverview() {
        return "Inflow: 48,100 BGN, Outflow: 925 BGN, Net flow: 47,175 BGN, New accounts: 30, Approval rate: 55.56%.";
    }

    public String getCards(Long customerId) {
        var cards = cardService.listMine(customerId);
        if (cards.isEmpty()) {
            return "You don’t have any cards.";
        }
        return cards.stream()
                .map(c -> "Card **** **** **** " + c.last4() + " (" + c.type() + "), expires " + c.expiration())
                .collect(Collectors.joining("; "));
    }

    public String getProfile(Long customerId) {
        CustomerDto dto = directoryDao.findCustomerById(customerId);
        if (dto == null) {
            return "I could not find your profile information.";
        }
        return "Profile: " + dto.firstName() + " " + dto.lastName()
                + ", email: " + dto.email()
                + ", phone: " + dto.phoneNumber()
                + ", address: " + dto.homeAddress();
    }

}
