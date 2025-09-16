package com.bank.dto;

import java.time.OffsetDateTime;

public record UserListItemDto(
        Long id,
        String name,           // username (users.name)
        String email,
        String role,
        OffsetDateTime registeredAt,
        boolean active,
        Integer accounts       // брой акаунти (NULL за служители без customer запис)
) {}
