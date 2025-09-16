package com.bank.service;

import com.bank.dao.CardDao;
import com.bank.dto.CardDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardService {
    private final CardDao cardDao;

    public CardService(CardDao cardDao) {
        this.cardDao = cardDao;
    }

    public List<CardDto> getCardsForAccount(Long accountId) {
        return cardDao.findByAccountId(accountId);
    }
}
