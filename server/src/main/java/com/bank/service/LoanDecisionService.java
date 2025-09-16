package com.bank.service;

import com.bank.dao.LoanApplicationDao;
import com.bank.dto.EvaluationBreakdown;
import com.bank.enums.LoanApplicationStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoanDecisionService {

    private final LoanApplicationDao loanApplicationDao;
    private final CreditEvaluationService creditEvaluationService;

    public LoanDecisionService(LoanApplicationDao loanApplicationDao,
                               CreditEvaluationService creditEvaluationService) {
        this.loanApplicationDao = loanApplicationDao;
        this.creditEvaluationService = creditEvaluationService;
    }

    @Transactional
    public boolean decide(Long applicationId, Long employeeUserId, boolean approve) {
        LoanApplicationStatus st = approve ? LoanApplicationStatus.APPROVED : LoanApplicationStatus.DECLINED;
        return loanApplicationDao.decide(applicationId, employeeUserId, st) == 1;
    }

    @Transactional
    public EvaluationBreakdown evaluateApplication(Long applicationId) {
        EvaluationBreakdown breakdown = creditEvaluationService.evaluate(applicationId);

        loanApplicationDao.saveEvaluationResult(
                applicationId,
                breakdown.composite(),
                breakdown.reasons(),
                LoanApplicationStatus.APPROVED
        );

        return breakdown;
    }

}
