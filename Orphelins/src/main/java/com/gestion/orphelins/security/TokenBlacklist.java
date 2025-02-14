package com.gestion.orphelins.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class TokenBlacklist {


    private final List<String> blacklistedTokens = new ArrayList<>() ;


    public void addToBlacklist(String token,int MAX_SIZE) {
        blacklistedTokens.add(token);
        log.info("Token ajouté à la blacklist. Taille actuelle: {}", blacklistedTokens.size());

        if (blacklistedTokens.size() > MAX_SIZE) {
            blacklistedTokens.remove(0);
            log.info("Nettoyage de la blacklist effectué. Nouvelle taille: {}", blacklistedTokens.size());
            blacklistedTokens.clear();
            log.info("Nettoyage de la blacklist effectué. Cleared: {}", blacklistedTokens.size());
        }
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

}
