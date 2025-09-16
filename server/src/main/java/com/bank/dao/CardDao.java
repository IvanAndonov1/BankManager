package com.bank.dao;

import com.bank.dto.CardDto;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CardDao {
    private final NamedParameterJdbcTemplate jdbc;
    public CardDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<CardDto> findByAccountId(Long accountId) {
        String sql = """
        SELECT card_number, expiration, type
        FROM cards
        WHERE account_id = :accountId
    """;
        var params = new MapSqlParameterSource("accountId", accountId);

        return jdbc.query(sql, params, (rs, rowNum) -> {
            String rawNumber = rs.getString("card_number");
            String masked = "**** **** **** " + rawNumber.substring(rawNumber.length() - 4);

            java.sql.Date expDate = rs.getDate("expiration");
            String expiration = new java.text.SimpleDateFormat("MM/yy").format(expDate);

            String type = rs.getString("type");

            return new CardDto(masked, expiration, type);
        });
    }



}
