package com.bank.security;

import com.bank.dao.BlacklistedTokenDao;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwt;
    private final BlacklistedTokenDao blacklistedTokenDao;

    public JwtAuthFilter(JwtService jwt, BlacklistedTokenDao blacklistedTokenDao) {
        this.jwt = jwt;
        this.blacklistedTokenDao = blacklistedTokenDao;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) {
        try {
            String h = req.getHeader(HttpHeaders.AUTHORIZATION);
            if (h != null && h.startsWith("Bearer ")) {
                String token = h.substring(7);

                if (blacklistedTokenDao.isBlacklisted(token)) {
                    SecurityContextHolder.clearContext();
                    chain.doFilter(req, res);
                    return;
                }

                Map<String, Object> c = jwt.parse(token);

                String role = String.valueOf(c.get("role"));
                Long uid = c.get("uid") instanceof Number n ? n.longValue() : null;

                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

                String principal = String.valueOf(c.get("sub"));

                var auth = new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        authorities
                );

                Map<String, Object> details = new HashMap<>();
                details.put("uid", uid);
                details.put("role", role);
                auth.setDetails(details);

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception ignored) {
            SecurityContextHolder.clearContext();
        }

        try {
            chain.doFilter(req, res);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
