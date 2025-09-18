package com.bank.web;

import com.bank.dto.CardDto;
import com.bank.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class CardController {
    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/{accountId}/cards")
    public List<CardDto> getCards(@PathVariable Long accountId) {
        return cardService.getCardsForAccount(accountId);
    }
}

