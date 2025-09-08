package com.bank.service;

import com.bank.dao.LoanApplicationDao;
import com.bank.dto.EvaluationResult;
import com.bank.dto.LoanApplicationDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;

@Service
public class CreditEvaluationService {

    private final LoanApplicationDao loanDao;

    public CreditEvaluationService(LoanApplicationDao loanDao) {
        this.loanDao = loanDao;
    }

    public EvaluationResult evaluate(Long loanId) {
        LoanApplicationDto loan = loanDao.findById(loanId);
        var reasons = new ArrayList<String>();
        int score = 0;

        // Tenure ≥ 6 months
        long tenureMonths = Period.between(loan.employerStartDate(), LocalDate.now()).toTotalMonths();
        if (tenureMonths >= 6) score += 25;
        else reasons.add("Employer tenure < 6 months");

        // 50% income rule
        BigDecimal newInstallment = loan.requestedAmount()
                .divide(BigDecimal.valueOf(loan.termMonths()), RoundingMode.HALF_UP);
        BigDecimal currentMonthly = loanDao.currentMonthlyInstallments(loan.customerId());
        BigDecimal half = loan.netSalary().multiply(BigDecimal.valueOf(0.5));
        if (half.compareTo(currentMonthly.add(newInstallment)) >= 0) score += 40;
        else reasons.add("Disposable income < 50% net salary after installments");

        // No late payments in last 12 months
        if (!loanDao.hasLateInLast12Months(loan.customerId())) score += 25;
        else reasons.add("Late payments in last 12 months");

        // (Optional) active loans soft penalty/bonus — skip for MVP or add later

        String finalStatus = (score >= 70) ? "APPROVED" : "DECLINED";

        loanDao.updateStatusAndScore(loanId, finalStatus, score, reasons);
        return new EvaluationResult(finalStatus, reasons);
    }
}
