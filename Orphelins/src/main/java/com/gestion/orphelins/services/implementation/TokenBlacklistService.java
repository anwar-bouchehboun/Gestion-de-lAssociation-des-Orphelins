package com.gestion.orphelins.services.implementation;


import com.gestion.orphelins.security.TokenBlacklist;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {

    private final TokenBlacklist tokenBlacklist;
    private static final int MAX_SIZE = 10;

    public void addToBlacklist(String token) {
        log.info("Ajout du token à la blacklist");
        tokenBlacklist.addToBlacklist(token,MAX_SIZE);
    }

    public boolean isTokenBlacklisted(String token) {
        return tokenBlacklist.isBlacklisted(token);
    }
}
