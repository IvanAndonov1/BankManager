package com.bank.web;

import com.bank.dao.AccountDao;
import com.bank.dto.*;
import com.bank.security.SecurityUtil;
import com.bank.service.AccountService;
import com.bank.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/{id}")
    public AccountDto byId(@PathVariable Long id) {
        return accountDao.findById(id).orElseThrow();
    }

    @GetMapping("/by-customer/{customerId}")
    public List<AccountDto> byCustomer(@PathVariable Long customerId) {
        if (isCustomer()) {
            Long uid = currentUserId();
            if (uid == null || !uid.equals(customerId)) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        return accountDao.findByCustomer(customerId);
    }

    @PostMapping
    public CreateAccountResponseDto createAccount(@RequestBody CreateAccountRequestDto req){

        if(req.customerId() == null){
            throw new IllegalArgumentException("Customer id is required!");
        }

        if(!isEmployeeOrAdmin()){

            if(!currentUserId().equals(req.customerId())){
                throw new AccessDeniedException("Forbidden!");
            }

        }

        Long accountId = accountService.createAccount(req.customerId());
        var acc = accountDao.findById(accountId).orElseThrow();

        return new CreateAccountResponseDto(
                acc.id(),
                acc.accountNumber(),
                acc.balance()
        );

    }

    @PostMapping("/{id}/deposit")
    public void deposit(@PathVariable Long id,
                        @RequestBody TransactionRequestDto req) {
        if (!isEmployeeOrAdmin()) {
            Long ownerId = accountDao.findCustomerIdByAccountId(id);
            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        accountService.deposit(id, req.amount(), req.description());
    }


    @PostMapping("/{id}/withdraw")
    public void withdraw(@PathVariable Long id,
                         @RequestBody TransactionRequestDto req) {
        if (!isEmployeeOrAdmin()) {
            Long ownerId = accountDao.findCustomerIdByAccountId(id);
            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        accountService.withdraw(id, req.amount(), req.description());
    }


    @PostMapping("/{id}/transfer")
    public void transfer(@PathVariable Long id,
                         @RequestBody TransferRequestDto req) {
        accountService.transfer(id, req.toAccountId(), req.amount(), req.description(),
                currentUserId(), isEmployeeOrAdmin());
        }

    }
