package com.bank.dao;

import com.bank.dao.mapper.LoanApplicationRowMapper;
import com.bank.dto.LoanApplicationDto;
import com.bank.enums.LoanApplicationStatus;
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
                       BigDecimal amount,
                       int termMonths,
                       LocalDate currentJobStartDate,
                       BigDecimal netSalary) {
        String sql = """
            INSERT INTO loan_applications
              (customer_id, requested_amount, term_months, employer_start_date, net_salary)
            VALUES(:c,:a,:t,:esd,:ns)
            RETURNING id
        """;

        var params = new MapSqlParameterSource()
                .addValue("c", customerId)
                .addValue("a", amount)
                .addValue("t", termMonths)
                .addValue("cjsd", currentJobStartDate)
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

    public int updatePricing(Long id,
                             String currency,
                             BigDecimal annualRate,
                             BigDecimal monthlyPayment,
                             BigDecimal totalPayable) {

        String sql = """
            UPDATE loan_applications
            SET currency=:cur,
                nominal_annual_rate=:rate,
                monthly_payment=:mp,
                total_payable=:tp,
                updated_at=now()
            WHERE id=:id
        """;

        return jdbc.update(sql, new MapSqlParameterSource()
                .addValue("cur", currency)
                .addValue("rate", annualRate)
                .addValue("mp", monthlyPayment)
                .addValue("tp", totalPayable)
                .addValue("id", id));

    }

    public int decide(Long id, Long userId, LoanApplicationStatus finalStatus){

        String sql = """
                UPDATE loan_applications
                SET status=:st, decided_by_user_id=:uid, decided_at=now(), updated_at=now()
                WHERE id=:id AND status='PENDING'
                """;

        return jdbc.update(sql, new MapSqlParameterSource()
                .addValue("st", finalStatus.name())
                .addValue("uid", userId)
                .addValue("id", id));

    }

    public BigDecimal currentMonthlyInstallments(Long customerId) {
        String sql = "SELECT monthly_installments FROM v_customer_monthly_installments WHERE customer_id=:c";
        return jdbc.query(sql, Map.of("c", customerId),
                rs -> rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO);
    }
    public int latePaymentsLast12m(Long customerId) {
        String sql = """
      SELECT COUNT(*) FROM payment_history
      WHERE customer_id=:c AND was_late
        AND occurred_at >= (CURRENT_DATE - INTERVAL '12 months')
    """;
        return jdbc.queryForObject(sql, Map.of("c", customerId), Integer.class);
    }

    public int distinctApprovedProductTypes(Long customerId) {
        String sql = """
      SELECT COUNT(DISTINCT product_type)
      FROM loan_applications
      WHERE customer_id=:c AND status='APPROVED'
    """;
        return jdbc.queryForObject(sql, Map.of("c", customerId), Integer.class);
    }
    public int approvedInLast6Months(Long customerId) {
        String sql = """
      SELECT COUNT(*) FROM loan_applications
      WHERE customer_id=:c
        AND status='APPROVED'
        AND created_at >= (now() - INTERVAL '6 months')
    """;
        return jdbc.queryForObject(sql, Map.of("c", customerId), Integer.class);
    }
    public long oldestAccountAgeMonths(Long customerId) {
        String sql = "SELECT MIN(created_at) FROM accounts WHERE customer_id=:c";
        var min = jdbc.query(sql, Map.of("c", customerId),
                rs -> rs.next() ? rs.getObject(1, java.time.OffsetDateTime.class) : null);
        if (min == null) return 0L;
        return java.time.Period.between(min.toLocalDate(), java.time.LocalDate.now()).toTotalMonths();
    }

    public java.math.BigDecimal totalCurrentBalance(Long customerId) {
        String sql = "SELECT COALESCE(SUM(balance),0) FROM accounts WHERE customer_id=:c";
        var v = jdbc.query(sql, Map.of("c", customerId),
                rs -> rs.next() ? rs.getBigDecimal(1) : java.math.BigDecimal.ZERO);
        return v == null ? java.math.BigDecimal.ZERO : v;
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
