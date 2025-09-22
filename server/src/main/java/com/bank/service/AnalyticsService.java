package com.bank.service;

import com.bank.dao.AnalyticsDao;
import com.bank.dto.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class AnalyticsService {

    private final AnalyticsDao dao;
    private final CreditEvaluationService evaluator;

    public AnalyticsService(AnalyticsDao dao, CreditEvaluationService evaluator) {

        this.dao = dao;
        this.evaluator = evaluator;

    }

    private static LocalDate[] normalize(LocalDate from, LocalDate to) {

        LocalDate end = (to == null) ? LocalDate.now() : to;

        LocalDate start = (from == null) ? end.minusDays(29) : from;

        if (start.isAfter(end)) {
            LocalDate tmp = start; start = end; end = tmp;
        }

        return new LocalDate[]{start, end};

    }

    public OverviewDto overview(LocalDate from, LocalDate to) {

        var p = normalize(from, to);
        LocalDate f = p[0], t = p[1];

        BigDecimal aum = dao.sumAum();

        var io = dao.inflowOutflow(f, t);

        BigDecimal inflow = io.get("inflow");
        BigDecimal outflow = io.get("outflow");
        BigDecimal net = inflow.subtract(outflow);

        int newAcc = dao.newAccounts(f, t);
        int active = dao.activeCustomers(f, t);

        var created = dao.loanCountsByStatusCreated(f, t);
        var decided = dao.loanCountsDecided(f, t);
        int pending  = created.getOrDefault("PENDING", 0);
        int approved = decided.getOrDefault("APPROVED", 0);
        int declined = decided.getOrDefault("DECLINED", 0);

        double approvalRate = (approved + declined) == 0 ? 0.0
                : (approved * 100.0) / (approved + declined);

        var disb = dao.disbursedAgg(f, t);
        long disbCount = ((Number) disb.get("cnt")).longValue();

        BigDecimal disbAmount = (BigDecimal) disb.getOrDefault("amount", BigDecimal.ZERO);
        BigDecimal avgTicket = disbCount == 0 ? BigDecimal.ZERO
                : disbAmount.divide(BigDecimal.valueOf(disbCount), 2, RoundingMode.HALF_UP);

        int openPendingNow = dao.openPendingAsOf(t);

        int borrowers = dao.borrowersTotal();
        int late30 = dao.borrowersLateInDays(30, t);
        int late90 = dao.borrowersLateInDays(90, t);
        double late30Share = borrowers == 0 ? 0.0 : (late30 * 100.0) / borrowers;
        double late90Share = borrowers == 0 ? 0.0 : (late90 * 100.0) / borrowers;

        return new OverviewDto(
                new OverviewDto.PeriodDto(f.toString(), t.toString()),
                aum,
                inflow,
                outflow,
                net,
                newAcc,
                active,
                new OverviewDto.LoanKpi(
                        pending, approved, declined, round2(approvalRate),
                        disbAmount.setScale(2, RoundingMode.HALF_UP),
                        avgTicket,
                        openPendingNow
                ),
                new OverviewDto.RiskProxy(round2(late30Share), round2(late90Share))
        );

    }


    public List<CashflowPointDto> cashflowDaily(LocalDate from, LocalDate to) {

        var p = normalize(from, to);
        return dao.cashflowDaily(p[0], p[1]);

    }

    public List<LoanDecisionsPointDto> loanDecisionsDaily(LocalDate from, LocalDate to) {

        var p = normalize(from, to);
        return dao.loanDecisionsDaily(p[0], p[1]);

    }

    public List<DisbursedPointDto> disbursedDaily(LocalDate from, LocalDate to) {

        var p = normalize(from, to);
        return dao.disbursedDaily(p[0], p[1]);

    }

    public List<KeyValueCountDto> topDeclineReasons(LocalDate from, LocalDate to, Integer limit) {

        var p = normalize(from, to);
        int lim = (limit == null ? 10 : Math.max(1, Math.min(100, limit)));

        return dao.topDeclineReasons(p[0], p[1], lim);

    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

}
