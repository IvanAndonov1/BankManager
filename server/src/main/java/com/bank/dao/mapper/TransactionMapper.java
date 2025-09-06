package com.bank.dao.mapper;

import com.bank.dto.TransactionDto;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TransactionMapper implements RowMapper<TransactionDto> {
    @Override public TransactionDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new TransactionDto(
                rs.getLong("id"),
                rs.getLong("account_id"),
                rs.getString("type"),
                rs.getBigDecimal("amount"),
                rs.getObject("date_time", java.time.OffsetDateTime.class),
                rs.getString("description")
        );
    }
}
