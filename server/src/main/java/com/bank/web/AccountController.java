package com.bank.web;

import com.bank.dao.AccountDao;
import com.bank.dto.*;
import com.bank.security.SecurityUtil;
import com.bank.service.AccountService;
import com.bank.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/by-id/{id}")
    public AccountDto byId(@PathVariable Long id) {

        if(!isEmployeeOrAdmin()){
            throw new AccessDeniedException("Forbidden!");
        }

        return accountDao.findById(id).orElseThrow();

    }

    @GetMapping("/{accountNumber}")
    public AccountDto byAccountNumber(@PathVariable String accountNumber) {

        if (isCustomer()) {

            Long ownerId = accountDao.findCustomerIdByAccountNumber(accountNumber);

            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }

        }

        return accountDao.findByAccountNumber(accountNumber).orElseThrow();
    }


    @GetMapping("/by-customer/{customerId}")
    public List<AccountDto> byCustomer(@PathVariable Long customerId) {

        if(!isEmployeeOrAdmin()){
            throw new AccessDeniedException("Forbidden!");
        }

        return accountDao.findByCustomer(customerId);

    }

    @GetMapping("/me")
    public List<AccountDto> myAccounts (){

        if(!isCustomer()){
            throw new AccessDeniedException("Forbidden!");
        }

        return accountDao.findByCustomer(currentUserId());

    }

    @PostMapping
    public CreateAccountResponseDto createAccount(@RequestBody CreateAccountRequestDto req){

        if(!isCustomer()){
            throw new AccessDeniedException("Onlu customers can create accounts!");
        }

        Long customerId = currentUserId();

        Long accountId = accountService.createAccount(customerId);

        var acc = accountDao.findById(accountId).orElseThrow();

        return new CreateAccountResponseDto(
                acc.accountNumber(),
                acc.balance()
        );

    }

    @PostMapping("/{accountNumber}/deposit")
    public void deposit(@PathVariable String accountNumber,
                        @RequestBody TransactionRequestDto req) {

        if (!isEmployeeOrAdmin()) {

            Long ownerId = accountDao.findCustomerIdByAccountNumber(accountNumber);

            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }
        }

        accountService.deposit(accountNumber, req.amount(), req.description());
    }

    @PostMapping("/{accountNumber}/withdraw")
    public void withdraw(@PathVariable String accountNumber,
                         @RequestBody TransactionRequestDto req) {

        if (!isEmployeeOrAdmin()) {

            Long ownerId = accountDao.findCustomerIdByAccountNumber(accountNumber);

            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }

        }

        accountService.withdraw(accountNumber, req.amount(), req.description());
    }


    @PostMapping("/{accountNumber}/transfer")
    public void transfer(@PathVariable String accountNumber,
                         @RequestBody TransferRequestDto req) {

        accountService.transfer(
                accountNumber,
                req.toAccountNumber(),
                req.amount(),
                req.description(),
                currentUserId(),
                isEmployeeOrAdmin());

        }

    }
