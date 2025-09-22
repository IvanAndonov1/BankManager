package com.bank.dao;

import com.bank.dto.CardDto;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;


@Repository
public class CardDao {

    private final NamedParameterJdbcTemplate jdbc;

    public CardDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Long create(Long accountId,
                       String publicId,
                       String pan,
                       String last4,
                       String cvv,
                       LocalDate expiration,
                       String type,
                       String holderName,
                       boolean isPrimary) {

        String sql = """
        INSERT INTO cards (
        account_id, public_id, card_number, last4, cvv,
        expiration, "type", holder_name, status, is_primary
        )
        VALUES (
            :acc, :pid, :pan, :last4, :cvv,
            :exp, :type, :holder, 'ACTIVE', :primary
        )
        RETURNING id
    """;

        var p = new MapSqlParameterSource()
                .addValue("acc", accountId)
                .addValue("pid", publicId)
                .addValue("pan", pan)
                .addValue("last4", last4)
                .addValue("cvv", cvv)
                .addValue("exp", expiration)
                .addValue("type", type)
                .addValue("holder", holderName)
                .addValue("primary", isPrimary);

        return jdbc.queryForObject(sql, p, Long.class);
    }


    public Map<String,Object> findByPublicIdForCustomer(String publicId, Long customerId) {

        String sql = """
            SELECT c.id, c.public_id, c.card_number, c.last4, c.cvv, c.expiration, c.type, c.status, c.holder_name, c.is_primary,
            a.account_number, a.customer_id
            FROM cards c
            JOIN accounts a ON a.id = c.account_id
            WHERE c.public_id = :pid
            AND a.customer_id = :cid
            LIMIT 1
        """;

        var p = new MapSqlParameterSource()
                .addValue("pid", publicId)
                .addValue("cid", customerId);
        var rows = jdbc.queryForList(sql, p);

        return rows.isEmpty() ? null : rows.get(0);

    }

    public List<CardDto> listMine(Long customerId) {

        String sql = """
            SELECT c.public_id, c.last4, c.type, c.status, c.expiration, c.is_primary, a.account_number
            FROM cards c
            JOIN accounts a ON a.id = c.account_id
            WHERE a.customer_id = :cid
            ORDER BY c.created_at DESC, c.id DESC
        """;

        return jdbc.query(sql, Map.of("cid", customerId), (rs,i) -> {

            String last4 = rs.getString("last4");
            String masked = "**** **** **** " + last4;

            return new CardDto(
                    rs.getString("public_id"),
                    masked,
                    last4,
                    rs.getString("type"),
                    rs.getString("status"),
                    rs.getString("expiration"),
                    rs.getBoolean("is_primary"),
                    rs.getString("account_number")
            );
        });

    }

    public List<CardDto> listByAccountNumber(String accountNumber, Long customerId) {

        String sql = """
            SELECT c.public_id, c.last4, c.type, c.status, c.expiration, c.is_primary, a.account_number
            FROM cards c
            JOIN accounts a ON a.id = c.account_id
            WHERE a.account_number = :acc
            AND a.customer_id   = :cid
            ORDER BY c.created_at DESC, c.id DESC
        """;

        var p = new MapSqlParameterSource()
                .addValue("acc", accountNumber)
                .addValue("cid", customerId);

        return jdbc.query(sql, p, (rs,i) -> {

            String last4 = rs.getString("last4");
            String masked = "**** **** **** " + last4;

            return new CardDto(
                    rs.getString("public_id"),
                    masked,
                    last4,
                    rs.getString("type"),
                    rs.getString("status"),
                    rs.getString("expiration"),
                    rs.getBoolean("is_primary"),
                    rs.getString("account_number")
            );
        });

    }

    public int block(String publicId, Long customerId) {

        String sql = """
            UPDATE cards c
            SET status = 'BLOCKED', updated_at = now()
            FROM accounts a
            WHERE c.account_id = a.id
            AND a.customer_id = :cid
            AND c.public_id   = :pid
        """;

        return jdbc.update(sql, new MapSqlParameterSource()
                .addValue("pid", publicId)
                .addValue("cid", customerId));
    }

    public int unblock(String publicId, Long customerId) {
        String sql = """
        UPDATE cards c
        SET status = 'ACTIVE',
        updated_at = now()
        FROM accounts a
        WHERE c.account_id = a.id
        AND a.customer_id = :cid
        AND c.public_id = :pid
        AND c.status = 'BLOCKED'
    """;

        return jdbc.update(
                sql,
                new MapSqlParameterSource()
                        .addValue("cid", customerId)
                        .addValue("pid", publicId)
        );
    }


    public boolean existsPan(String pan) {

        String sql = "SELECT EXISTS(SELECT 1 FROM cards WHERE card_number = :pan)";
        return Boolean.TRUE.equals(jdbc.queryForObject(sql, Map.of("pan", pan), Boolean.class));

    }

}