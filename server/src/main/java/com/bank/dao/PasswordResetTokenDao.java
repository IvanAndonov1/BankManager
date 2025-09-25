package com.bank.dao;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;

@Repository
public class PasswordResetTokenDao {

    private final NamedParameterJdbcTemplate jdbc;

    public PasswordResetTokenDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }  

    public void create(Long userId, String code, OffsetDateTime expiresAt) {
        String sql = """
            INSERT INTO password_reset_tokens(user_id, code, expires_at, used)
            VALUES(:uid, :c, :exp, false)
        """;
        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("uid", userId)
                .addValue("c", code)
                .addValue("exp", expiresAt));
    }

    public boolean validateCode(Long userId, String code) {
        String sql = """
            SELECT COUNT(*) FROM password_reset_tokens
            WHERE user_id = :uid AND code = :c
              AND used = false
              AND expires_at > now()
        """;
        Integer count = jdbc.queryForObject(sql,
                new MapSqlParameterSource().addValue("uid", userId).addValue("c", code),
                Integer.class);
        return count != null && count > 0;
    }

    public void markUsed(Long userId, String code) {
        String sql = """
            UPDATE password_reset_tokens
            SET used = true
            WHERE user_id = :uid AND code = :c
        """;
        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("uid", userId)
                .addValue("c", code));
    }
}
