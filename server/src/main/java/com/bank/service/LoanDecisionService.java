package com.bank.service;

import com.bank.dao.LoanApplicationDao;
import com.bank.dto.EvaluationBreakdown;
import com.bank.enums.LoanApplicationStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LoanDecisionService {

    private final LoanApplicationDao loanApplicationDao;
    private final CreditEvaluationService creditEvaluationService;

    public LoanDecisionService(LoanApplicationDao loanApplicationDao, CreditEvaluationService creditEvaluationService) {

        this.loanApplicationDao = loanApplicationDao;
        this.creditEvaluationService = creditEvaluationService;

    }

    @Transactional
    public boolean decide(Long applicationId, Long employeeUserId, boolean approve, List<String> reasons) {

        LoanApplicationStatus st = approve ? LoanApplicationStatus.APPROVED : LoanApplicationStatus.DECLINED;

        int updated = loanApplicationDao.decide(applicationId, employeeUserId, st);

        if (updated != 1) {
            return false;
        }

        if (approve) {
            // идемпотентно дисбурсиране (ако вече е правено, методът връща false и не внася втори път)
            loanApplicationDao.disburseIfNeeded(applicationId);
        } else {

            if (reasons != null && !reasons.isEmpty()) {
                loanApplicationDao.setDecisionReasons(applicationId, reasons);
            }

        }

        return true;

    }

    @Transactional
    public EvaluationBreakdown evaluateApplication(Long applicationId) {

        EvaluationBreakdown breakdown = creditEvaluationService.evaluate(applicationId);

        loanApplicationDao.saveEvaluationResult(
                applicationId,
                breakdown.composite(),
                breakdown.reasons(),
                LoanApplicationStatus.PENDING,
                breakdown.recommendation()
        );

        return breakdown;
    }

}
