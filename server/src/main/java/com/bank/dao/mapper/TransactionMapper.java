package com.bank.dao.mapper;

import com.bank.dto.TransactionDto;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class TransactionMapper implements RowMapper<TransactionDto> {
    @Override
    public TransactionDto mapRow(ResultSet rs, int rowNum) throws java.sql.SQLException {
        return new TransactionDto(
                rs.getLong("id"),
                rs.getLong("account_id"),
                rs.getString("type"),
                rs.getBigDecimal("amount"),
                rs.getObject("date_time") != null ? rs.getObject("date_time").toString() : null,
                rs.getString("description"),
                rs.getString("card_type")
        );

    }
}
