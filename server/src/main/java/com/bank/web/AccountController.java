package com.bank.web;

import com.bank.dao.AccountDao;
import com.bank.dto.AccountDto;
import com.bank.service.AccountService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

import static com.bank.security.SecurityUtil.*;

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
        // Customers can only view their own accounts
        if (isCustomer()) {
            Long uid = currentUserId();
            if (uid == null || !uid.equals(customerId)) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        // Employee/Admin can view any
        return accountDao.findByCustomer(customerId);
    }

    @PostMapping("/{id}/deposit")
    public void deposit(@PathVariable Long id,
                        @RequestParam BigDecimal amount,
                        @RequestParam(defaultValue = "") String description) {
        // Customer can only operate on own account
        if (!isEmployeeOrAdmin()) {
            Long ownerId = accountDao.findCustomerIdByAccountId(id);
            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        accountService.deposit(id, amount, description);
    }

    @PostMapping("/{id}/withdraw")
    public void withdraw(@PathVariable Long id,
                         @RequestParam BigDecimal amount,
                         @RequestParam(defaultValue = "") String description) {
        // Customer can only operate on own account
        if (!isEmployeeOrAdmin()) {
            Long ownerId = accountDao.findCustomerIdByAccountId(id);
            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        accountService.withdraw(id, amount, description);
    }

    @PostMapping("/transfer")
    public void transfer(@RequestParam Long fromId,
                         @RequestParam Long toId,
                         @RequestParam BigDecimal amount,
                         @RequestParam(defaultValue = "") String description) {
        if (fromId.equals(toId)) throw new IllegalArgumentException("Same account");

        // Customer can only transfer from their own account
        if (!isEmployeeOrAdmin()) {
            Long ownerId = accountDao.findCustomerIdByAccountId(fromId);
            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        accountService.transfer(fromId, toId, amount, description);
    }
}
