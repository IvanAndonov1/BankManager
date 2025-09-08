package com.bank.dao;

import com.bank.dto.TransactionDto;
import com.bank.dao.mapper.TransactionMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public class TransactionDao {
    private final NamedParameterJdbcTemplate jdbc;
    private final TransactionMapper mapper = new TransactionMapper();

    public TransactionDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Long create(Long accountId, String type, BigDecimal amount, String description) {
        String sql = """
            INSERT INTO transactions (account_id, type, amount, description)
            VALUES (:acc, :type, :amt, :descr)
            RETURNING id
        """;
        var p = new MapSqlParameterSource()
                .addValue("acc", accountId)
                .addValue("type", type)
                .addValue("amt", amount)
                .addValue("descr", description);
        return jdbc.queryForObject(sql, p, Long.class);
    }

    public List<TransactionDto> findByAccount(Long accountId) {
        String sql = """
            SELECT id, account_id, type, amount, description, created_at
            FROM transactions
            WHERE account_id=:acc
            ORDER BY id DESC
        """;
        return jdbc.query(sql, new MapSqlParameterSource("acc", accountId), mapper);
    }
}
