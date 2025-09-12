package com.bank.dao;

import com.bank.dto.UserListItemDto;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Repository
public class UserDirectoryDao {

    private final NamedParameterJdbcTemplate jdbc;

    public UserDirectoryDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<UserListItemDto> MAPPER = (ResultSet rs, int i) -> {
        // Опит 1: директно като OffsetDateTime (JDBC 4.2)
        OffsetDateTime created = null;
        try {
            created = rs.getObject("created_at", OffsetDateTime.class);
        } catch (Throwable ignored) {
            // паднем ли тук, минаваме към Timestamp
        }
        if (created == null) {
            Timestamp ts = rs.getTimestamp("created_at");
            if (ts != null) {
                created = ts.toInstant().atOffset(ZoneOffset.UTC);
            }
        }

        Integer accounts = null;
        Object accObj = rs.getObject("accounts");
        if (accObj != null) {
            if (accObj instanceof Number n) {
                accounts = n.intValue();
            } else {
                try { accounts = Integer.valueOf(accObj.toString()); } catch (Exception ignored) {}
            }
        }

        return new UserListItemDto(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("role"),
                created,
                rs.getBoolean("active"),
                accounts
        );
    };

    public List<UserListItemDto> listByRole(String role) {
        String sql = """
            SELECT u.id, u.name, u.email, u.role, u.created_at, u.active,
                   CASE WHEN :role = 'CUSTOMER' THEN COALESCE(acc.cnt, 0) ELSE NULL END AS accounts
            FROM users u
            LEFT JOIN (
                SELECT c.id AS cid, COUNT(a.id) AS cnt
                FROM customers c
                LEFT JOIN accounts a ON a.customer_id = c.id
                GROUP BY c.id
            ) acc ON (u.id = acc.cid)
            WHERE u.role = :role
            ORDER BY u.created_at DESC, u.id DESC
        """;
        var params = new MapSqlParameterSource("role", role);
        return jdbc.query(sql, params, MAPPER);
    }
    public List<UserListItemDto> listByRolePaged(String role, int page, int size, String q, Boolean active) {
        int safeSize = Math.max(size, 1);
        int safePage = Math.max(page, 0);
        int offset = safePage * safeSize;

        String sql = """
        SELECT u.id, u.name, u.email, u.role, u.created_at, u.active,
               COALESCE(acc.cnt, 0) AS accounts
        FROM users u
        LEFT JOIN (
            SELECT c.id AS cid, COUNT(a.id) AS cnt
            FROM customers c
            LEFT JOIN accounts a ON a.customer_id = c.id
            GROUP BY c.id
        ) acc ON (u.id = acc.cid)
        WHERE u.role = :role
          AND ( :activeFilter = false OR u.active = :active )
          AND ( :qFilter = false OR u.name ILIKE :qLike OR u.email ILIKE :qLike )
        ORDER BY u.created_at DESC, u.id DESC
        LIMIT :size OFFSET :offset
    """;

        boolean activeFilter = active != null;
        boolean qFilter = (q != null && !q.isBlank());
        String qLike = qFilter ? "%" + q + "%" : null;

        var params = new MapSqlParameterSource()
                .addValue("role", role)
                .addValue("activeFilter", activeFilter)
                .addValue("active", active)
                .addValue("qFilter", qFilter)
                .addValue("qLike", qLike)
                .addValue("size", safeSize)
                .addValue("offset", offset);

        return jdbc.query(sql, params, MAPPER);
    }



}
