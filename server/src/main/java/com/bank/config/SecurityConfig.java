package com.bank.config;

import com.bank.security.JwtAuthFilter;
import com.bank.security.JwtService;
import com.bank.dao.BlacklistedTokenDao;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain api(HttpSecurity http,
                                   JwtService jwt,
                                   BlacklistedTokenDao blacklistedTokenDao) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .addFilterBefore(new JwtAuthFilter(jwt, blacklistedTokenDao), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/actuator/**").permitAll()
                        .requestMatchers("/api/health", "/api/v1/health").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/employees/**").hasAnyRole("EMPLOYEE", "ADMIN")
                        .requestMatchers("/api/customers/**").hasAnyRole("EMPLOYEE", "ADMIN")
                        .requestMatchers("/api/loans/**", "/api/accounts/**").authenticated()
                        .requestMatchers("/api/ai/**").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}
