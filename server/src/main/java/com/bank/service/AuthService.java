package com.bank.service;

import com.bank.dao.BlacklistedTokenDao;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final BlacklistedTokenDao blacklist;

    public AuthService(BlacklistedTokenDao blacklist) {
        this.blacklist = blacklist;
    }

    public void logout(String token, Long userId) {
        blacklist.blacklist(token, userId);
    }
}
