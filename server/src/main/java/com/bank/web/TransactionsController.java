package com.bank.web;

import com.bank.dao.AccountDao;
import com.bank.dao.TransactionDao;
import com.bank.dto.TransactionDto;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.bank.security.SecurityUtil.*;

@RestController
@RequestMapping("/api/accounts")
public class TransactionsController {

    private final TransactionDao dao;
    private final AccountDao accountDao;

    public TransactionsController(TransactionDao dao, AccountDao accountDao) {
        this.dao = dao;
        this.accountDao = accountDao;
    }

    @GetMapping("/{accountNumber}/transactions")
    public List<TransactionDto> list(@PathVariable String accountNumber,
                                     @RequestParam(defaultValue = "50") int limit,
                                     @RequestParam(defaultValue = "0") int offset) {

        if (!isEmployeeOrAdmin()) {

            Long ownerId = accountDao.findCustomerIdByAccountNumber(accountNumber);

            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }

        }

        Long accountId = accountDao.findIdByAccountNumber(accountNumber);

        if (accountId == null) {
            throw new IllegalArgumentException("Account not found");
        }

        limit  = Math.max(1, Math.min(100, limit));
        offset = Math.max(0, offset);

        return dao.findByAccount(accountId, limit, offset);

    }

}
