package com.bank.config;

import com.bank.security.JwtAuthFilter;
import com.bank.security.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain api(HttpSecurity http, JwtService jwt) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .addFilterBefore(new JwtAuthFilter(jwt), BasicAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/actuator/**").permitAll()
                        .requestMatchers("/api/health", "/api/v1/health").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        // Directory endpoints: employees only for employees/admin
                        .requestMatchers("/api/employees/**").hasAnyRole("EMPLOYEE","ADMIN")
                        .requestMatchers("/api/customers/**").hasAnyRole("EMPLOYEE","ADMIN")
                        // Loans & Accounts: customers can access their flow, employees/admin too
                        .requestMatchers("/api/loans/**", "/api/accounts/**").authenticated()
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}
