package com.bank.dao.mapper;

import com.bank.dto.AccountDto;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AccountMapper implements RowMapper<AccountDto> {
    @Override public AccountDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new AccountDto(
                rs.getString("account_number"),
                rs.getBigDecimal("balance")
        );
    }
}
