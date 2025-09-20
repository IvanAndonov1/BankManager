package com.bank.dao;

import com.bank.dao.mapper.LoanApplicationRowMapper;
import com.bank.dto.EvaluationBreakdown;
import com.bank.dto.LoanApplicationDto;
import com.bank.dto.LoanApplicationEmployeeAdminResponse;
import com.bank.dto.LoanApplicationMineDto;
import com.bank.enums.EvaluationRecommendation;
import com.bank.enums.LoanApplicationStatus;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.LongFunction;

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

    public Long findAccountByNumberForCustomer (String accountNumber, Long customerId){

        String sql = """
                SELECT id FROM accounts
                WHERE account_number = :num AND customer_id = :cid
                LIMIT 1
                """;

        var p = new MapSqlParameterSource()
                .addValue("num", accountNumber)
                .addValue("cid", customerId);

        return jdbc.query(sql, p, rs -> rs.next() ? rs.getLong(1) : null);

    }

    public boolean accountNumberBelongsToCustomer (String accountNumber, Long customerId){

        String sql = """
                SELECT EXISTS (SELECT 1 
                                FROM accounts 
                                WHERE account_number=:num
                                AND customer_id=:cid)
                """;

        var p = new MapSqlParameterSource()
                .addValue("num", accountNumber)
                .addValue("cid", customerId);

        return Boolean.TRUE.equals(jdbc.queryForObject(sql, p, Boolean.class));

    }

    public List<LoanApplicationDto> findByCustomer(Long customerId) {

        String sql = "SELECT * FROM loan_applications WHERE customer_id=:c ORDER BY created_at DESC";

        return jdbc.query(sql, Map.of("c", customerId), new LoanApplicationRowMapper());

    }

    public List<LoanApplicationMineDto> findMineByCustomer(Long customerId, LongFunction<EvaluationBreakdown> evaluatorFn) {

        String sql = """
        SELECT id,
        requested_amount,
        term_months,
        status,
        reasons,
        currency,
        created_at,
        updated_at
        FROM loan_applications
        WHERE customer_id = :c
        ORDER BY created_at DESC, id DESC
    """;

        var p = new MapSqlParameterSource("c", customerId);

        return jdbc.query(sql, p, (rs, i) -> {
            Long appId = rs.getLong("id");

            var status = LoanApplicationStatus.valueOf(rs.getString("status"));

            List<String> reasons = java.util.List.of();

            var dbArr = rs.getArray("reasons");

            if (status == LoanApplicationStatus.DECLINED && dbArr != null) {

                String[] arr = (String[]) dbArr.getArray();

                if (arr != null && arr.length > 0) {
                    reasons = Arrays.asList(arr);
                }

            }

            var eb = evaluatorFn.apply(appId);

            var eval = new LoanApplicationMineDto.EvaluationView(
                    eb.percentageOfMax(),
                    eb.maxPossiblePoints(),
                    eb.creditScore(),
                    new LoanApplicationMineDto.Scores(
                            eb.cushionScore(),
                            eb.tenureScore(),
                            eb.dtiScore(),
                            eb.recentDebtScore(),
                            eb.accountAgeScore()
                    ),
                    eb.accumulatedPoints()
            );

            return new LoanApplicationMineDto(
                    rs.getBigDecimal("requested_amount"),
                    rs.getInt("term_months"),
                    status,
                    reasons,
                    rs.getString("currency"),
                    rs.getObject("created_at", OffsetDateTime.class),
                    rs.getObject("updated_at", OffsetDateTime.class),
                    eval
            );
        });
    }

    public List<LoanApplicationEmployeeAdminResponse> findForStaffBasics(
            Integer limit,
            Integer offset,
            String status,
            Long customerId
    ) {
        String base = """
        SELECT
            la.id,
            la.customer_id,
            la.requested_amount,
            la.term_months,
            la.status,
            la.current_job_start_date,
            la.net_salary,
            la.currency,
            la.nominal_annual_rate,
            la.monthly_payment,
            la.total_payable,
            a.account_number AS target_account_number,
            la.decided_by_user_id,
            la.decided_at,
            la.reasons,
            la.disbursed_at,
            la.disbursed_amount,
            la.created_at,
            la.updated_at
        FROM loan_applications la
        LEFT JOIN accounts a ON a.id = la.target_account_id
        """;

        String orderPage = " ORDER BY la.created_at DESC, la.id DESC LIMIT :lim OFFSET :off";

        var p = new MapSqlParameterSource()
                .addValue("lim", Math.max(1, Math.min(200, (limit == null ? 50 : limit))))
                .addValue("off", Math.max(0, (offset == null ? 0 : offset)));

        List<String> where = new java.util.ArrayList<>();

        if (status != null && !status.isBlank()) {
            where.add("la.status = :st");
            p.addValue("st", status.toUpperCase());
        }
        if (customerId != null) {
            where.add("la.customer_id = :cid");
            p.addValue("cid", customerId);
        }

        String sql = base + (where.isEmpty() ? "" : " WHERE " + String.join(" AND ", where)) + orderPage;

        return jdbc.query(sql, p, (rs, i) -> {
            String[] arr = (rs.getArray("reasons") == null) ? null : (String[]) rs.getArray("reasons").getArray();
            List<String> reasons = (arr == null) ? List.of() : java.util.Arrays.asList(arr);

            return new LoanApplicationEmployeeAdminResponse(
                    rs.getLong("id"),
                    rs.getLong("customer_id"),
                    rs.getBigDecimal("requested_amount"),
                    rs.getInt("term_months"),
                    com.bank.enums.LoanApplicationStatus.valueOf(rs.getString("status")),
                    rs.getObject("current_job_start_date", java.time.LocalDate.class),
                    rs.getBigDecimal("net_salary"),
                    rs.getString("currency"),
                    rs.getBigDecimal("nominal_annual_rate"),
                    rs.getBigDecimal("monthly_payment"),
                    rs.getBigDecimal("total_payable"),
                    rs.getString("target_account_number"),
                    (Long) rs.getObject("decided_by_user_id"),
                    rs.getObject("decided_at", java.time.OffsetDateTime.class),
                    reasons,
                    rs.getObject("disbursed_at", java.time.OffsetDateTime.class),
                    rs.getBigDecimal("disbursed_amount"),
                    rs.getObject("created_at", java.time.OffsetDateTime.class),
                    rs.getObject("updated_at", java.time.OffsetDateTime.class)
            );
        });
    }


}
