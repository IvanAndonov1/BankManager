package com.bank.dao;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BlacklistedTokenDao {
    private final NamedParameterJdbcTemplate jdbc;

    public BlacklistedTokenDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void blacklist(String token, Long userId) {
        String sql = "INSERT INTO blacklisted_tokens (token, user_id) VALUES (:token, :uid)";
        var p = new MapSqlParameterSource()
                .addValue("token", token)
                .addValue("uid", userId);
        jdbc.update(sql, p);
    }

    public boolean isBlacklisted(String token) {
        String sql = "SELECT COUNT(*) FROM blacklisted_tokens WHERE token=:token";
        var p = new MapSqlParameterSource("token", token);
        Integer count = jdbc.queryForObject(sql, p, Integer.class);
        return count != null && count > 0;
    }
}
