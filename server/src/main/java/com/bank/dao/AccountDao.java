package com.bank.dao;

import com.bank.dto.AccountDto;
import com.bank.dao.mapper.AccountMapper;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public class AccountDao {
    private final NamedParameterJdbcTemplate jdbc;
    private final AccountMapper mapper = new AccountMapper();

    public AccountDao(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

    public Optional<AccountDto> findById(Long id) {
        String sql = "SELECT id, customer_id, account_number, balance FROM accounts WHERE id=:id";
        var p = new MapSqlParameterSource("id", id);
        var list = jdbc.query(sql, p, mapper);
        return list.stream().findFirst();
    }

    public List<AccountDto> findByCustomer(Long customerId) {
        String sql = """
            SELECT id, customer_id, account_number, balance
            FROM accounts
            WHERE customer_id=:cid
            ORDER BY id
        """;
        return jdbc.query(sql, new MapSqlParameterSource("cid", customerId), mapper);
    }

    public Long create(Long customerId, String accountNumber) {
        String sql = """
            INSERT INTO accounts (customer_id, account_number, balance)
            VALUES (:cid, :acc, 0)
            RETURNING id
        """;
        var p = new MapSqlParameterSource()
                .addValue("cid", customerId)
                .addValue("acc", accountNumber);
        return jdbc.queryForObject(sql, p, Long.class);
    }
    public BigDecimal getBalance(Long accountId) {
        String sql = "SELECT balance FROM accounts WHERE id=:id";
        var p = new MapSqlParameterSource("id", accountId);
        BigDecimal result = jdbc.query(sql, p, rs -> rs.next() ? rs.getBigDecimal(1) : null);
        if(result == null){
            return BigDecimal.ZERO;
        }
        System.out.println("DEBUG getBalance accountId=" + accountId + " result=" + result);
        return result;
    }

    public boolean exists(Long accountId) {
        String sql = "SELECT COUNT(*) FROM accounts WHERE id=:id";
        var p = new MapSqlParameterSource("id", accountId);
        Integer count = jdbc.queryForObject(sql, p, Integer.class);
        return count != null && count > 0;
    }


    public int updateBalance(Long id, BigDecimal newBalance) {
        String sql = "UPDATE accounts SET balance=:b WHERE id=:id";
        return jdbc.update(sql, new MapSqlParameterSource()
                .addValue("b", newBalance)
                .addValue("id", id));
    }
    public Long findCustomerIdByAccountId(Long accountId) {
        String sql = "SELECT customer_id FROM accounts WHERE id=:id";
        var p = new MapSqlParameterSource("id", accountId);
        return jdbc.query(sql, p, rs -> rs.next() ? rs.getLong(1) : null);
    }

    //get last 10 transactions for account

}
