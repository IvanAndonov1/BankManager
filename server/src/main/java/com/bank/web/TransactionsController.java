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

    @GetMapping("/{accountId}/transactions")
    public List<TransactionDto> list(@PathVariable Long accountId,
                                     @RequestParam(defaultValue = "50") int limit,
                                     @RequestParam(defaultValue = "0") int offset) {
        // Customer can only view transactions for own account
        if (!isEmployeeOrAdmin()) {
            Long ownerId = accountDao.findCustomerIdByAccountId(accountId);
            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        limit = Math.max(1, Math.min(100, limit));
        offset = Math.max(0, offset);
        return dao.findByAccount(accountId, limit, offset);
    }
}
