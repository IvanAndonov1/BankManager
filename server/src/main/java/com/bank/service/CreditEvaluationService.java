package com.bank.service;

import com.bank.dao.LoanApplicationDao;
import com.bank.dto.EvaluationBreakdown;
import com.bank.dto.LoanApplicationDto;
import com.bank.enums.EvaluationRecommendation;
import com.bank.enums.LoanApplicationStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Service
public class CreditEvaluationService {

    private final LoanPricingService pricingService;

    private static final BigDecimal ZERO = BigDecimal.ZERO;
    private static final int MAX_POINTS = 5 * 100;

    private final LoanApplicationDao loanDao;

    public CreditEvaluationService(LoanApplicationDao loanDao, LoanPricingService pricingService) {

        this.loanDao = loanDao;
        this.pricingService = pricingService;

    }

    private EvaluationBreakdown emptyBreakdown(List<String> reasons) {

        return new EvaluationBreakdown(
                LoanApplicationStatus.PENDING,
                reasons,
                0, 0, 0, 0, 0,       // 5-те скорове
                0,                   // composite
                0,                   // accumulated
                MAX_POINTS,          // max=500
                0.0,                 // percentageOfMax
                "0/" + MAX_POINTS,   // creditScore
                EvaluationRecommendation.CONSIDER
        );

    }

    public EvaluationBreakdown evaluate(Long loanId) {

        LoanApplicationDto loan = loanDao.findById(loanId);
        List<String> reasons = new ArrayList<>();

        if (loan.termMonths() == null || loan.termMonths() <= 0) {
            reasons.add("termMonths must be > 0");
            return emptyBreakdown(reasons);
        }
        if (loan.currentJobStartDate() == null || loan.netSalary() == null) {
            reasons.add("currentJobStartDate and netSalary are required");
            return emptyBreakdown(reasons);
        }
        if (loan.netSalary().compareTo(ZERO) <= 0) {
            reasons.add("netSalary must be > 0");
            return emptyBreakdown(reasons);
        }

        long tenureMonths = Math.max(0, Period.between(loan.currentJobStartDate(), LocalDate.now()).toTotalMonths());
        int tenureScore = bandTenure(tenureMonths);

        var pricing = pricingService.calculate(loan.requestedAmount(), loan.termMonths());
        BigDecimal newInstallment = pricing.monthlyPayment();

        BigDecimal currentMonthly = loanDao.currentMonthlyInstallments(loan.customerId());
        BigDecimal totalMonthly = currentMonthly.add(newInstallment);

        BigDecimal dti = (loan.netSalary().compareTo(ZERO) > 0)
                ? totalMonthly.divide(loan.netSalary(), 6, RoundingMode.HALF_UP)
                : BigDecimal.ONE;

        int dtiScore = bandDTI(dti);

        int late12m = loanDao.latePaymentsLast12m(loan.customerId());
        long oldestAcctMonths = loanDao.oldestAccountAgeMonths(loan.customerId());

        int accountAgeScore = bandAccountAge(oldestAcctMonths);

        BigDecimal totalBalance = loanDao.totalCurrentBalance(loan.customerId());

        int cushionScore;

        if (totalMonthly.compareTo(ZERO) <= 0) {
            cushionScore = 100;
        } else {

            BigDecimal cushion = totalBalance.divide(totalMonthly, 6, RoundingMode.HALF_UP);
            cushionScore = bandCushion(cushion);

        }

        int recentDebtScore = bandRecentNewDebt(loanDao.approvedInLast6Months(loan.customerId()));

        int accumulatedPoints = tenureScore
                + dtiScore
                + accountAgeScore
                + cushionScore
                + recentDebtScore;

        int composite = accumulatedPoints / 5;
        double percentageOfMax = (accumulatedPoints * 100.0) / MAX_POINTS;
        String creditScore = accumulatedPoints + "/" + MAX_POINTS;

        EvaluationRecommendation recommendation;

        if (percentageOfMax < 40.0) {
            recommendation = EvaluationRecommendation.DECLINE;
        } else if (percentageOfMax < 70.0) { // [40, 70)
            recommendation = EvaluationRecommendation.CONSIDER;
        } else {
            recommendation = EvaluationRecommendation.APPROVE;
        }

        return new EvaluationBreakdown(
                LoanApplicationStatus.PENDING,
                reasons,
                tenureScore,
                dtiScore,
                accountAgeScore,
                cushionScore,
                recentDebtScore,
                composite,
                accumulatedPoints,
                MAX_POINTS,
                percentageOfMax,
                creditScore,
                recommendation
        );

    }


    private int bandTenure(long months) {

        if (months >= 24) return 100;
        if (months >= 12) return 80;
        if (months >= 6)  return 60;
        if (months >= 3)  return 30;
        return 0;

    }

    private int bandDTI(BigDecimal dti) {

        if (dti.compareTo(new BigDecimal("0.20")) <= 0) return 100;
        if (dti.compareTo(new BigDecimal("0.30")) <= 0) return 90;
        if (dti.compareTo(new BigDecimal("0.40")) <= 0) return 75;
        if (dti.compareTo(new BigDecimal("0.50")) <= 0) return 60;
        if (dti.compareTo(new BigDecimal("0.60")) <= 0) return 40;
        if (dti.compareTo(new BigDecimal("0.70")) <= 0) return 20;
        return 0; // > 0.70

    }

    private int bandAccountAge(long months) {

        if (months >= 36) return 100;
        if (months >= 24) return 80;
        if (months >= 12) return 60;
        if (months >= 6)  return 40;
        return 20;

    }

    private int bandCushion(BigDecimal cushion) {

        if (cushion.compareTo(new BigDecimal("3.0")) >= 0) return 100;
        if (cushion.compareTo(new BigDecimal("2.0")) >= 0) return 80;
        if (cushion.compareTo(new BigDecimal("1.0")) >= 0) return 60;
        if (cushion.compareTo(new BigDecimal("0.5")) >= 0) return 30;
        return 0;

    }

    private int bandRecentNewDebt(int count) {

        if (count <= 0) return 100;
        if (count == 1) return 60;
        if (count == 2) return 30;
        return 0; // >=3

    }
}
