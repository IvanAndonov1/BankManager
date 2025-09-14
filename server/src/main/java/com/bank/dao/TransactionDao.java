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

    public List<TransactionDto> findByAccount(Long accountId, int limit, int offset) {
        String sql = """
        SELECT id, account_id, type, amount, date_time, description
        FROM transactions
        WHERE account_id = :acc
        ORDER BY date_time DESC, id DESC
        LIMIT :limit OFFSET :offset
    """;
        var p = new MapSqlParameterSource()
                .addValue("acc", accountId)
                .addValue("limit", Math.max(1, Math.min(100, limit)))
                .addValue("offset", Math.max(0, offset));
        return jdbc.query(sql, p, mapper); // reuse your existing mapper instance
    }

}
