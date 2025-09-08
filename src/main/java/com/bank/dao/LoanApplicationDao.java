package com.bank.dao;

import com.bank.dao.mapper.LoanApplicationRowMapper;
import com.bank.dto.LoanApplicationDto;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public class LoanApplicationDao {

    private final NamedParameterJdbcTemplate jdbc;

    public LoanApplicationDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Long create(Long customerId,
                       String productType,
                       BigDecimal amount,
                       int termMonths,
                       LocalDate employerStartDate,
                       BigDecimal netSalary) {
        String sql = """
            INSERT INTO loan_applications
              (customer_id, product_type, requested_amount, term_months, employer_start_date, net_salary)
            VALUES(:c,:p,:a,:t,:esd,:ns)
            RETURNING id
        """;

        var params = new MapSqlParameterSource()
                .addValue("c", customerId)
                .addValue("p", productType)
                .addValue("a", amount)
                .addValue("t", termMonths)
                .addValue("esd", employerStartDate)
                .addValue("ns", netSalary);

        return jdbc.queryForObject(sql, params, Long.class);
    }

    public LoanApplicationDto findById(Long id) {
        return jdbc.queryForObject(
                "SELECT * FROM loan_applications WHERE id=:id",
                Map.of("id", id),
                new LoanApplicationRowMapper()
        );
    }

    public void updateStatusAndScore(Long id,
                                     String status,
                                     int score,
                                     List<String> reasons) {
        String sql = """
            UPDATE loan_applications
            SET status=:s, score=:sc, reasons=:r, updated_at=now()
            WHERE id=:id
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("s", status)
                .addValue("sc", score)
                .addValue("r", reasons.toArray(new String[0]))
                .addValue("id", id));
    }

    public BigDecimal currentMonthlyInstallments(Long customerId) {
        String sql = "SELECT monthly_installments FROM v_customer_monthly_installments WHERE customer_id=:c";
        return jdbc.query(sql, Map.of("c", customerId),
                rs -> rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO);
    }

    public boolean hasLateInLast12Months(Long customerId) {
        String sql = """
            SELECT EXISTS(
                SELECT 1
                FROM payment_history
                WHERE customer_id=:c
                  AND was_late
                  AND occurred_at >= (CURRENT_DATE - INTERVAL '12 months')
            )
        """;
        return Boolean.TRUE.equals(jdbc.queryForObject(sql, Map.of("c", customerId), Boolean.class));
    }
}
