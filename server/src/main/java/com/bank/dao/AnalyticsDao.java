package com.bank.dao;

import com.bank.dto.CashflowPointDto;
import com.bank.dto.DisbursedPointDto;
import com.bank.dto.KeyValueCountDto;
import com.bank.dto.LoanDecisionsPointDto;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class AnalyticsDao {

    private final NamedParameterJdbcTemplate jdbc;

    public AnalyticsDao(NamedParameterJdbcTemplate jdbc){
        this.jdbc = jdbc;
    }

    public BigDecimal sumAum(){

        return jdbc.query("SELECT COALESCE(SUM(balance), 0) FROM accounts",
                Map.of(), rs -> rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO);

    }

    public Map<String, BigDecimal> inflowOutflow(LocalDate from, LocalDate toIncl){

        String sql = """
                SELECT 
                COALESCE(SUM(CASE WHEN type IN ('DEPOSIT', 'TRANSFER IN', 'CREDIT') THEN amount END),0) AS inflow,
                COALESCE(SUM(CASE WHEN type IN ('WITHDRAW', 'TRANSFER_OUT', 'DEBIT') THEN amount END),0) AS outflow
                FROM transactions
                WHERE date_time >= :from::date
                AND date_time < (:to::date + INTERVAL '1 day')
                """;

        var m = jdbc.queryForMap(sql, new MapSqlParameterSource()
                .addValue("from", from)
                .addValue("to", toIncl));

        return Map.of(
                "inflow", (BigDecimal) m.getOrDefault("inflow", BigDecimal.ZERO),
                "outflow", (BigDecimal) m.getOrDefault("outflow", BigDecimal.ZERO)
        );

    }

    public int newAccounts(LocalDate from, LocalDate toIncl) {

        String sql = """
            SELECT COUNT(*) FROM accounts
            WHERE created_at >= :from::date
            AND created_at <  (:to::date + INTERVAL '1 day')
        """;

        return jdbc.queryForObject(sql, new MapSqlParameterSource()
                .addValue("from", from).addValue("to", toIncl), Integer.class);

    }

    public int activeCustomers(LocalDate from, LocalDate toIncl) {

        String sql = """
            SELECT COUNT(DISTINCT a.customer_id)
            FROM transactions t
            JOIN accounts a ON a.id = t.account_id
            WHERE t.date_time >= :from::date
            AND t.date_time <  (:to::date + INTERVAL '1 day')
        """;

        return jdbc.queryForObject(sql, new MapSqlParameterSource()
                .addValue("from", from).addValue("to", toIncl), Integer.class);

    }

    public Map<String,Integer> loanCountsByStatusCreated(LocalDate from, LocalDate toIncl) {

        String sql = """
            SELECT status, COUNT(*) cnt
            FROM loan_applications
            WHERE created_at >= :from::date
            AND created_at <  (:to::date + INTERVAL '1 day')
            GROUP BY status
        """;

        var rows = jdbc.queryForList(sql, new MapSqlParameterSource()
                .addValue("from", from).addValue("to", toIncl));

        Map<String,Integer> out = new HashMap<>();

        for (var r : rows){
            out.put(String.valueOf(r.get("status")), ((Number)r.get("cnt")).intValue());
        }

        return out;

    }

    public Map<String,Integer> loanCountsDecided(LocalDate from, LocalDate toIncl) {

        String sql = """
            SELECT status, COUNT(*) cnt
            FROM loan_applications
            WHERE decided_at >= :from::date
            AND decided_at <  (:to::date + INTERVAL '1 day')
            AND status IN ('APPROVED','DECLINED')
            GROUP BY status
        """;

        var rows = jdbc.queryForList(sql, new MapSqlParameterSource()
                .addValue("from", from).addValue("to", toIncl));

        Map<String,Integer> out = new HashMap<>();

        for (var r : rows) {
            out.put(String.valueOf(r.get("status")), ((Number)r.get("cnt")).intValue());
        }

        return out;

    }

    public Map<String,Object> disbursedAgg(LocalDate from, LocalDate toIncl) {

        String sql = """
            SELECT COUNT(*) AS cnt,
            COALESCE(SUM(disbursed_amount),0) AS amount
            FROM loan_applications
            WHERE disbursed_at >= :from::date
            AND disbursed_at <  (:to::date + INTERVAL '1 day')
        """;

        return jdbc.queryForMap(sql, new MapSqlParameterSource()
                .addValue("from", from).addValue("to", toIncl));

    }

    public int borrowersTotal() {

        String sql = "SELECT COUNT(DISTINCT customer_id) FROM loan_applications WHERE status='APPROVED'";
        return jdbc.queryForObject(sql, Map.of(), Integer.class);

    }


    public int borrowersLateInDays(int days, LocalDate anchorTo) {

        String sql = """
                    SELECT COUNT(DISTINCT ph.customer_id)
                    FROM payment_history ph
                    JOIN loan_applications la ON la.customer_id = ph.customer_id AND la.status='APPROVED'
                    WHERE ph.was_late = TRUE
                    AND ph.occurred_at >= (:to::date - :days * INTERVAL '1 day')
                    AND ph.occurred_at <  (:to::date + INTERVAL '1 day')
                """;

        return jdbc.queryForObject(sql, new MapSqlParameterSource()
                .addValue("days", days)
                .addValue("to", anchorTo), Integer.class);

    }

    public List<CashflowPointDto> cashflowDaily(LocalDate from, LocalDate toIncl) {

        String sql = """
        SELECT
        to_char(d::date, 'YYYY-MM-DD') AS day,
        COALESCE(SUM(CASE WHEN t.type IN ('DEPOSIT','TRANSFER_IN','CREDIT')  THEN t.amount END),0) AS inflow,
        COALESCE(SUM(CASE WHEN t.type IN ('WITHDRAW','TRANSFER_OUT','DEBIT') THEN t.amount END),0) AS outflow
        FROM generate_series(:from::date, :to::date, '1 day') d
        LEFT JOIN transactions t
        ON t.date_time >= d::date
        AND t.date_time <  (d::date + INTERVAL '1 day')
        GROUP BY day
        ORDER BY day
    """;

        return jdbc.query(
                sql,
                new MapSqlParameterSource().addValue("from", from).addValue("to", toIncl),
                (rs,i) -> {
                    var inflow  = rs.getBigDecimal("inflow");
                    var outflow = rs.getBigDecimal("outflow");
                    var net     = inflow.subtract(outflow);
                    return new CashflowPointDto(
                            rs.getString("day"),
                            inflow, outflow, net
                    );
                }
        );

    }

    public List<LoanDecisionsPointDto> loanDecisionsDaily(LocalDate from, LocalDate toIncl) {

        String sql = """
        WITH days AS (SELECT generate_series(:from::date, :to::date, '1 day')::date AS d)
        SELECT
        to_char(d.d, 'YYYY-MM-DD') AS day,
        (SELECT COUNT(*) FROM loan_applications la
        WHERE la.created_at >= d.d
        AND la.created_at <  d.d + INTERVAL '1 day') AS created,
        (SELECT COUNT(*) FROM loan_applications la
        WHERE la.decided_at >= d.d
        AND la.decided_at <  d.d + INTERVAL '1 day'
        AND la.status='APPROVED') AS approved,
        (SELECT COUNT(*) FROM loan_applications la
        WHERE la.decided_at >= d.d
        AND la.decided_at <  d.d + INTERVAL '1 day'
        AND la.status='DECLINED') AS declined
        FROM days d
        ORDER BY day
    """;

        return jdbc.query(
                sql,
                new MapSqlParameterSource().addValue("from", from).addValue("to", toIncl),
                (rs,i) -> new LoanDecisionsPointDto(
                        rs.getString("day"),
                        rs.getInt("created"),
                        rs.getInt("approved"),
                        rs.getInt("declined")
                )
        );
    }

    public List<DisbursedPointDto> disbursedDaily(LocalDate from, LocalDate toIncl) {

        String sql = """
        WITH days AS (SELECT generate_series(:from::date, :to::date, '1 day')::date AS d)
        SELECT
        to_char(d.d, 'YYYY-MM-DD') AS day,
        (SELECT COUNT(*) FROM loan_applications la
        WHERE la.disbursed_at >= d.d
        AND la.disbursed_at <  d.d + INTERVAL '1 day') AS cnt,
        (SELECT COALESCE(SUM(disbursed_amount),0) FROM loan_applications la
        WHERE la.disbursed_at >= d.d
        AND la.disbursed_at <  d.d + INTERVAL '1 day') AS amount
        FROM days d
        ORDER BY day
    """;

        return jdbc.query(
                sql,
                new MapSqlParameterSource().addValue("from", from).addValue("to", toIncl),
                (rs,i) -> new DisbursedPointDto(
                        rs.getString("day"),
                        rs.getInt("cnt"),
                        rs.getBigDecimal("amount")
                )
        );

    }


    public List<KeyValueCountDto> topDeclineReasons(LocalDate from, LocalDate toIncl, int limit) {

        String sql = """
            SELECT reason, COUNT(*) AS cnt
            FROM (
            SELECT unnest(reasons) AS reason
            FROM loan_applications
            WHERE status='DECLINED'
            AND decided_at >= :from::date
            AND decided_at <  (:to::date + INTERVAL '1 day')
            ) x
            GROUP BY reason
            ORDER BY cnt DESC
            LIMIT :lim
        """;

        return jdbc.query(sql, new MapSqlParameterSource()
                        .addValue("from", from).addValue("to", toIncl).addValue("lim", Math.max(1, limit)),
                (rs,i) -> new KeyValueCountDto(rs.getString("reason"), rs.getLong("cnt")));

    }

    public int openPendingAsOf(LocalDate asOf) {

        String sql = """
        SELECT COUNT(*) 
        FROM loan_applications
        WHERE status = 'PENDING'
        AND created_at < (:to::date + INTERVAL '1 day')
    """;
        return jdbc.queryForObject(
                sql,
                new MapSqlParameterSource().addValue("to", asOf),
                Integer.class
        );

    }

}
