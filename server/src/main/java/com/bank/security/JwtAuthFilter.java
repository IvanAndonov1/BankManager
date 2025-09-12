package com.bank.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.List;
import java.util.Map;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwt;

    public JwtAuthFilter(JwtService jwt) { this.jwt = jwt; }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) {
        try {
            String h = req.getHeader(HttpHeaders.AUTHORIZATION);
            if (h != null && h.startsWith("Bearer ")) {
                String token = h.substring(7);
                Map<String,Object> c = jwt.parse(token);
                String role = String.valueOf(c.get("role"));
                var auth = new AbstractAuthenticationToken(List.of(new SimpleGrantedAuthority("ROLE_" + role))) {
                    @Override public Object getCredentials() { return token; }
                    @Override public Object getPrincipal() { return c.get("sub"); }
                };
                auth.setAuthenticated(true);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception ignored) {
            SecurityContextHolder.clearContext();
        }
        try { chain.doFilter(req, res); } catch (Exception e) { throw new RuntimeException(e); }
    }
}
