package com.bank.dao.mapper;

import com.bank.dto.LoanApplicationDto;
import com.bank.enums.LoanApplicationStatus;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

public class LoanApplicationRowMapper implements RowMapper<LoanApplicationDto> {
    @Override
    public LoanApplicationDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        String[] reasonsArr = null;
        if (rs.getArray("reasons") != null) {
            reasonsArr = (String[]) rs.getArray("reasons").getArray();
        }
        List<String> reasons = (reasonsArr == null) ? List.of() : Arrays.asList(reasonsArr);

        return new LoanApplicationDto(
                rs.getLong("id"),
                rs.getLong("customer_id"),
                rs.getBigDecimal("requested_amount"),
                rs.getInt("term_months"),
                LoanApplicationStatus.valueOf(rs.getString("status")),
                reasons,
                rs.getObject("current_job_start_date", LocalDate.class),
                rs.getBigDecimal("net_salary"),
                rs.getString("currency"),
                rs.getBigDecimal("nominal_annual_rate"),
                rs.getBigDecimal("monthly_payment"),
                rs.getBigDecimal("total_payable"),
                rs.getObject("created_at", OffsetDateTime.class),
                rs.getObject("updated_at", OffsetDateTime.class),

                rs.getBigDecimal("evaluation_composite"),
                rs.getString("evaluation_reasons"),
                rs.getString("evaluation_status")
        );
    }
}
