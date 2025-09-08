package com.bank.web;

import com.bank.dao.mapper.AccountDao;
import com.bank.dto.AccountDto;
import com.bank.dao.mapper.AccountMapper;
import com.bank.service.AccountService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountDao accountDao;
    private final AccountService accountService;

    public AccountController(AccountDao accountDao, AccountService accountService) {
        this.accountDao = accountDao;
        this.accountService = accountService;
    }

    @GetMapping("/by-customer/{customerId}")
    public List<AccountDto> byCustomer(@PathVariable Long customerId) {
        return accountDao.findByCustomer(customerId);
    }

    @PostMapping("/{id}/deposit")
    public void deposit(@PathVariable Long id, @RequestParam BigDecimal amount,
                        @RequestParam(defaultValue = "") String description) {
        accountService.deposit(id, amount, description);
    }

    @PostMapping("/{id}/withdraw")
    public void withdraw(@PathVariable Long id, @RequestParam BigDecimal amount,
                         @RequestParam(defaultValue = "") String description) {
        accountService.withdraw(id, amount, description);
    }

    @PostMapping("/transfer")
    public void transfer(@RequestParam Long fromId, @RequestParam Long toId,
                         @RequestParam BigDecimal amount,
                         @RequestParam(defaultValue = "") String description) {
        accountService.transfer(fromId, toId, amount, description);
    }
}
