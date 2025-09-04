package com.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;                 // ✅ add this
import org.springframework.data.jpa.repository.config.EnableJpaRepositories; // ✅ add this

@SpringBootApplication
@EntityScan("com.bank")                    // ensures entities are found
@EnableJpaRepositories("com.bank")        // ensures repos are found
public class ServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }
}
