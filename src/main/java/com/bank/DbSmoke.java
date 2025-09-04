package com.bank;

import com.bank.models.Customer;
import com.bank.models.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DbSmoke {
    @Bean
    CommandLineRunner smoke(CustomerRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(Customer.builder().username("first").build());
            }
            System.out.println("Customers in DB: " + repo.count());
        };
    }
}
