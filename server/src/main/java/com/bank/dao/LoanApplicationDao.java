package com.bank.dao;

import com.bank.dao.mapper.LoanApplicationRowMapper;
import com.bank.dto.LoanApplicationDto;
import com.bank.enums.EvaluationRecommendation;
import com.bank.enums.LoanApplicationStatus;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
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
              (customer_id, requested_amount, term_months, current_job_start_date, net_salary)
            VALUES(:c, :a, :t, :cjsd, :ns)
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
        OffsetDateTime min = jdbc.query(sql, Map.of("c", customerId),
                rs -> rs.next() ? rs.getObject(1, OffsetDateTime.class) : null);
        if (min == null) return 0L;
        return java.time.Period.between(min.toLocalDate(), java.time.LocalDate.now()).toTotalMonths();
    }

    public BigDecimal totalCurrentBalance(Long customerId) {
        String sql = "SELECT COALESCE(SUM(balance),0) FROM accounts WHERE customer_id=:c";
        BigDecimal v = jdbc.query(sql, Map.of("c", customerId),
                rs -> rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO);
        return v == null ? BigDecimal.ZERO : v;
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

    public Long findCustomerIdByApplicationId(Long appId) {
        String sql = "SELECT customer_id FROM loan_applications WHERE id=:id";
        var p = new MapSqlParameterSource("id", appId);
        return jdbc.query(sql, p, rs -> rs.next() ? rs.getLong(1) : null);
    }
    public int saveEvaluationResult(Long applicationId, int composite, List<String> reasons, LoanApplicationStatus status, EvaluationRecommendation recommendation) {

        String sql = """
        UPDATE loan_applications
        SET evaluation_composite = :composite,
            evaluation_reasons   = :reasons,
            evaluation_status    = :status,
            evaluation_recommendation = :rec,
            updated_at = now()
        WHERE id = :id
    """;

        var params = new MapSqlParameterSource()
                .addValue("composite", composite)
                .addValue("reasons", String.join(",", reasons))
                .addValue("status", status.name())
                .addValue("rec", recommendation.name())
                .addValue("id", applicationId);

        return jdbc.update(sql, params);
    }

    public int setDecisionReasons(Long applicationId, List<String> reasons){

        String sql = """
                UPDATE loan_applications
                SET reasons = :reasons, updated_at = now()
                WHERE id = :id
                """;

        var params = new MapSqlParameterSource()
                .addValue("id", applicationId)
                .addValue("reasons", reasons.toArray(new String[0]));

        return jdbc.update(sql, params);

    }

    public boolean accountBelongsToCustomer(Long accountId, Long customerId){

        String sql = """
                SELECT EXISTS(SELECT 1 FROM accounts
                                WHERE id=:a 
                                AND customer_id=:c)
                """;

        return Boolean.TRUE.equals(jdbc.queryForObject(sql, Map.of("a", accountId, "c", customerId), Boolean.class));

    }

    public int updateTargetAccount (Long applicationId, Long accountId){

        String sql = """
                UPDATE loan_applications
                SET target_account_id = :acc, updated_at = now()
                WHERE id = :id
                """;

        return jdbc.update(sql, new MapSqlParameterSource()
                .addValue("acc", accountId)
                .addValue("id", applicationId));

    }

    public boolean disburseIfNeeded(Long applicationId) {

        String q = """
        SELECT la.customer_id, la.requested_amount, la.target_account_id, la.disbursed_at
        FROM loan_applications la
        WHERE la.id = :id
        FOR UPDATE
    """;

        var row = jdbc.query(q, Map.of("id", applicationId), rs -> {

            if (!rs.next()) {
                return null;
            }

            Map<String, Object> m = new java.util.HashMap<>();
            m.put("customerId", rs.getLong("customer_id"));
            m.put("amount", rs.getBigDecimal("requested_amount"));
            m.put("accountId", rs.getLong("target_account_id"));
            m.put("disbursedAt", rs.getObject("disbursed_at", java.time.OffsetDateTime.class));

            return m;

        });

        if (row == null) {
            throw new IllegalArgumentException("Application not found!");
        }

        if (row.get("disbursedAt") != null) {
            return false; // вече дисбурснато
        }

        Long accountId = (Long) row.get("accountId");

        if (accountId == null) {
            throw new IllegalStateException("No target account set for this application!");
        }

        BigDecimal amount = (BigDecimal) row.get("amount");

        if (amount == null) {
            throw new IllegalStateException("Requested amount is null!");
        }

        // увеличава баланса на сметката
        String updBalance = """
        UPDATE accounts 
        SET balance = balance + :amt, updated_at = now()
        WHERE id = :acc
    """;

        jdbc.update(updBalance, new MapSqlParameterSource()
                .addValue("amt", amount)
                .addValue("acc", accountId));

        // записва транзакция
        String insTxn = """
        INSERT INTO transactions (account_id, type, amount, date_time, description)
        VALUES (:acc, 'CREDIT', :amt, now(), 'Loan disbursement')
    """;

        jdbc.update(insTxn, new MapSqlParameterSource()
                .addValue("acc", accountId)
                .addValue("amt", amount));

        // маркирва се дисбурсването в заявлението
        String mark = """
        UPDATE loan_applications
        SET disbursed_at = now(),
            disbursed_amount = :amt,
            updated_at = now()
        WHERE id = :id
    """;
        jdbc.update(mark, new MapSqlParameterSource().addValue("amt", amount).addValue("id", applicationId));

        return true;
    }

}
