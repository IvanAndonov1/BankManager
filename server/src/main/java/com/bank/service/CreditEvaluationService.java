package com.bank.service;

import com.bank.dao.LoanApplicationDao;
import com.bank.dto.EvaluationBreakdown;
import com.bank.dto.EvaluationResult;
import com.bank.dto.LoanApplicationDto;
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

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    // Income level bands (adjust if needed)
    private static final BigDecimal L1 = new BigDecimal("1500");
    private static final BigDecimal L2 = new BigDecimal("2000");
    private static final BigDecimal L3 = new BigDecimal("3000");
    private static final BigDecimal L4 = new BigDecimal("4000");

    private final LoanApplicationDao loanDao;

    public CreditEvaluationService(LoanApplicationDao loanDao) {
        this.loanDao = loanDao;
    }

    public EvaluationBreakdown evaluate(Long loanId) {
        LoanApplicationDto loan = loanDao.findById(loanId);
        List<String> reasons = new ArrayList<>();

        // --- Basic input validation
        if (loan.termMonths() == null || loan.termMonths() <= 0) {
            reasons.add("termMonths must be > 0");
            return new EvaluationBreakdown(LoanApplicationStatus.PENDING, reasons, 0,0,0,0,0,0,0);
        }
        if (loan.currentJobStartDate() == null || loan.netSalary() == null) {
            reasons.add("currentJobStartDate and netSalary are required");
            return new EvaluationBreakdown(LoanApplicationStatus.PENDING, reasons, 0,0,0,0,0,0,0);
        }
        if (loan.netSalary().compareTo(ZERO) <= 0) {
            reasons.add("netSalary must be > 0");
            return new EvaluationBreakdown(LoanApplicationStatus.PENDING, reasons, 0,0,0,0,0,0,0);
        }

        // --- Derived values
        long tenureMonths = Period.between(loan.currentJobStartDate(), LocalDate.now()).toTotalMonths();

        BigDecimal newInstallment = loan.requestedAmount()
                .divide(BigDecimal.valueOf(loan.termMonths()), RoundingMode.HALF_UP);

        BigDecimal currentMonthly = loanDao.currentMonthlyInstallments(loan.customerId());
        BigDecimal totalMonthly = currentMonthly.add(newInstallment);

        int late12m = loanDao.latePaymentsLast12m(loan.customerId());
        long oldestAcctMonths = loanDao.oldestAccountAgeMonths(loan.customerId());
        BigDecimal totalBalance = loanDao.totalCurrentBalance(loan.customerId());

        // --- A) Employment Tenure + hard rule
        int tenureScore = bandTenure(tenureMonths);
        if (tenureMonths < 6) reasons.add("Employer tenure < 6 months");

        // --- B) DTI + hard 50% rule
        BigDecimal dti = (loan.netSalary().compareTo(ZERO) > 0)
                ? totalMonthly.divide(loan.netSalary(), 6, RoundingMode.HALF_UP)
                : BigDecimal.ONE;
        int dtiScore = bandDTI(dti);
        if (loan.netSalary().multiply(new BigDecimal("0.5")).compareTo(totalMonthly) < 0) {
            reasons.add("Disposable income < 50% net salary after installments");
        }

        // --- C) Late payments hard rule (band not included in composite per your scope)
        if (late12m > 0) {
            reasons.add("Late payments in last 12 months");
        }

        // --- D) Income level
        int incomeScore = bandIncome(loan.netSalary());

        // --- E) Account age (oldest account)
        int accountAgeScore = bandAccountAge(oldestAcctMonths);

        // --- F) Balance cushion (proxy: total balance / total monthly installments)
        int cushionScore;
        if (totalMonthly.compareTo(ZERO) <= 0) {
            cushionScore = 100; // no existing+new installments → perfect cushion
        } else {
            BigDecimal cushion = totalBalance.divide(totalMonthly, 6, RoundingMode.HALF_UP);
            cushionScore = bandCushion(cushion);
        }

        // --- H) Recent new debt (approved in last 6 months)
        int recentDebtScore = bandRecentNewDebt(loanDao.approvedInLast6Months(loan.customerId()));

//        // --- Final decision
//        boolean hardFail = tenureMonths < 6
//                || loan.netSalary().multiply(new BigDecimal("0.5")).compareTo(totalMonthly) < 0
//                || late12m > 0;

        int composite = (tenureScore + dtiScore + incomeScore + accountAgeScore + cushionScore + recentDebtScore) / 6;

//        String finalStatus = hardFail ? "DECLINED" : (composite >= 70 ? "APPROVED" : "DECLINED");
//        if (!hardFail && composite < 70 && reasons.isEmpty()) {
//            reasons.add("Composite score below threshold (>= 70 required)");
//        }
//
//        loanDao.updateStatusAndScore(loanId, finalStatus, composite, reasons);

        return new EvaluationBreakdown(
                LoanApplicationStatus.PENDING,
                reasons,
                tenureScore, dtiScore, incomeScore, accountAgeScore, cushionScore, recentDebtScore,
                composite
        );
    }

    // --- Band mappers ---

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

    private int bandIncome(BigDecimal netSalary) {
        if (netSalary.compareTo(L4) >= 0) return 100;  // >= 4000
        if (netSalary.compareTo(L3) >= 0) return 80;   // 3000–3999
        if (netSalary.compareTo(L2) >= 0) return 60;   // 2000–2999
        if (netSalary.compareTo(L1) >= 0) return 40;   // 1500–1999
        return 20;                                     // < 1500
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
