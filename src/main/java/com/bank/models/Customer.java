package com.bank.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String username;
}
