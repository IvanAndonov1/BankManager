package com.bank.dto;

import com.bank.enums.LoanApplicationStatus;

import java.util.List;

public record EvaluationBreakdown(
        LoanApplicationStatus status,
        List<String> reasons,
        int tenureScore,
        int dtiScore,
        int incomeScore,
        int accountAgeScore,
        int cushionScore,
        int recentDebtScore,
        int composite,
        int accumulatedPoints,
        int maxPossiblePoints,
        double riskAssessment,
        String creditScore
) {}
