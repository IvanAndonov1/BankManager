package com.bank.web;

import com.bank.dto.TransactionDto;
import com.bank.dao.TransactionDao;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class TransactionsController {

    private final TransactionDao dao;

    public TransactionsController(TransactionDao dao) { this.dao = dao; }

    @GetMapping("/{accountId}/transactions")
    public List<TransactionDto> byAccount(@PathVariable Long accountId,
                                          @RequestParam(defaultValue = "50") int limit,
                                          @RequestParam(defaultValue = "0") int offset) {
        return dao.findByAccount(accountId, limit, offset);
    }
}
