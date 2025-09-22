package com.bank.web;

import com.bank.dao.AccountDao;
import com.bank.dto.*;
import com.bank.service.CardService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

import static com.bank.security.SecurityUtil.currentUserId;
import static com.bank.security.SecurityUtil.isCustomer;

@RestController
@RequestMapping("/api/cards")
public class CardsController {

    private final CardService cardService;
    private final AccountDao accountDao;

    public CardsController(CardService cardService, AccountDao accountDao) {
        this.cardService = cardService;
        this.accountDao = accountDao;
    }

    @GetMapping("/mine")
    public List<CardDto> mine() throws AccessDeniedException {

        if (!isCustomer()) {
            throw new AccessDeniedException("Forbidden");
        }

        return cardService.listMine(currentUserId());

    }

    @GetMapping("/by-account/{accountNumber}")
    public List<CardDto> byAccount(@PathVariable String accountNumber) throws AccessDeniedException {

        if (!isCustomer()) {
            throw new AccessDeniedException("Forbidden");
        }

        return cardService.listByAccount(accountNumber, currentUserId());

    }

    @PostMapping
    public CreateCardResponseDto create(@RequestBody CreateCardRequestDto req) throws AccessDeniedException {

        if (!isCustomer()) {
            throw new AccessDeniedException("Forbidden");
        }

        if (req.accountNumber() == null || req.accountNumber().isBlank()) {
            throw new IllegalArgumentException("accountNumber is required");
        }

        Long ownerId = accountDao.findCustomerIdByAccountNumber(req.accountNumber());

        if (ownerId == null || !ownerId.equals(currentUserId())) {
            throw new AccessDeniedException("Forbidden");
        }

        String type   = (req.type() == null || req.type().isBlank()) ? "DEBIT" : req.type();
        String holder = (req.holderName() == null || req.holderName().isBlank())
                ? SecurityContextHolder.getContext().getAuthentication().getName().toUpperCase()
                : req.holderName();

        // Създаваме картата и получаваме обратно пълния PAN и други данни (вътрешно)
        var created = cardService.issueAdditional(req.accountNumber(), currentUserId(), holder, type);

        // Маскираме PAN за отговора
        String pan   = created.cardNumber();               // вътрешно поле (не се връща към клиента)
        String last4 = pan.substring(pan.length() - 4);
        String masked = "**** **** **** " + last4;

        YearMonth exp = created.expiration();

        return new CreateCardResponseDto(
                masked,
                last4,
                created.type(),
                exp.toString(),
                req.accountNumber()
        );

    }

    @PostMapping("/{publicId}/reveal")
    public RevealCardResponseDto reveal(@PathVariable String publicId,
                                        @RequestBody RevealCardRequestDto req) throws AccessDeniedException {

        if (!isCustomer()) {
            throw new AccessDeniedException("Forbidden");
        }

        return cardService.reveal(publicId, currentUserId(), req.password());

    }

    @PostMapping("/{publicId}/block")
    public void block(@PathVariable String publicId) throws AccessDeniedException {

        if (!isCustomer()) {
            throw new AccessDeniedException("Forbidden");
        }

        cardService.block(publicId, currentUserId());

    }

    @PostMapping("/{publicId}/unblock")
    public Map<String, Object> unblock(@PathVariable String publicId) throws AccessDeniedException {

        if (!isCustomer()) {
            throw new AccessDeniedException("Forbidden");
        }

        Long customerId = currentUserId();
        cardService.unblock(publicId, customerId);
        return Map.of("ok", true, "status", "ACTIVE");

    }

}
