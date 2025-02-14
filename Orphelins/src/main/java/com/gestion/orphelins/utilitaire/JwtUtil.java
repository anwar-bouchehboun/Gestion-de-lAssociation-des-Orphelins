package com.gestion.orphelins.utilitaire;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.gestion.orphelins.entity.User;

import javax.validation.ValidationException;
import java.security.Key;
import java.util.Date;

import com.gestion.orphelins.enums.Roleenum;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationTime;

    @Value("${jwt.issuer}")
    private String issuer;

    public String generateToken(String username, String email, Roleenum role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("username", username)
                .claim("role", role.name())
                .setIssuer(issuer)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims extractClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ValidationException e) {
            throw new ValidationException("JWT signature does not match");
        }
    }

    public String extractSubject(String token) {
        return extractClaims(token).getSubject();
    }

    public Roleenum extractRole(String token) {
        Claims claims = extractClaims(token);
        return Roleenum.valueOf(claims.get("role", String.class));
    }

    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractSubject(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public boolean hasRole(String token, Roleenum role) {
        Roleenum tokenRole = extractRole(token);
        return tokenRole == role;
    }
}
