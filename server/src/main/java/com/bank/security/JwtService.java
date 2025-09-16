package com.bank.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtService {

    private final byte[] key;
    private final long ttlMillis;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.ttl-minutes}") long ttlMinutes) {
        this.key = secret.getBytes(StandardCharsets.UTF_8);
        this.ttlMillis = ttlMinutes * 60_000L;
    }

    public String generate(Long userId, String username, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(username)
                .addClaims(Map.of("uid", userId, "role", role))
                .setIssuedAt(Date.from(now))
                .setExpiration(new Date(now.toEpochMilli() + ttlMillis))
                .signWith(Keys.hmacShaKeyFor(key), SignatureAlgorithm.HS256)
                .compact();
    }

    public Map<String, Object> parse(String token) {
        var claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(key))
                .build()
                .parseClaimsJws(token)
                .getBody();
        return Map.of(
                "sub", claims.getSubject(),
                "uid", claims.get("uid", Object.class),
                "role", claims.get("role", Object.class)
        );
    }
}
