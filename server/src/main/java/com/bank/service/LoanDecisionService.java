package com.bank.service;

import com.bank.dao.LoanApplicationDao;
import com.bank.enums.LoanApplicationStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoanDecisionService {

    private final LoanApplicationDao dao;

    public LoanDecisionService(LoanApplicationDao dao){
        this.dao = dao;
    }

    @Transactional
    public boolean decide (Long applicationId, Long employeeUserId, boolean approve){

        LoanApplicationStatus st = approve ? LoanApplicationStatus.APPROVED : LoanApplicationStatus.DECLINED;
        return dao.decide(applicationId, employeeUserId, st) == 1;

    }

}
