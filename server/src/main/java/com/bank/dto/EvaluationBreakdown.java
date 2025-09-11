package com.bank.dto;

import com.bank.enums.LoanApplicationStatus;

import java.util.List;

public record EvaluationBreakdown(
        LoanApplicationStatus status,
        List<String> reasons,
        int tenureScore,       // A
        int dtiScore,          // B
        int incomeScore,       // D
        int accountAgeScore,   // E
        int cushionScore,      // F
        int recentDebtScore,   // H
        int composite
) {}
