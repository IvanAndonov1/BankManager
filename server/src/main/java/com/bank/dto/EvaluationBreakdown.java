package com.bank.dto;

import com.bank.enums.EvaluationRecommendation;
import com.bank.enums.LoanApplicationStatus;

import java.util.List;

public record EvaluationBreakdown(
        LoanApplicationStatus status,
        List<String> reasons,
        int tenureScore,
        int dtiScore,
        int accountAgeScore,
        int cushionScore,
        int recentDebtScore,
        int composite,
        int accumulatedPoints,
        int maxPossiblePoints,
        double percentageOfMax,
        String creditScore,
        EvaluationRecommendation recommendation // препоръка към служителя
) {
    public double percentageOfMax() {
        return percentageOfMax;
    }

    public EvaluationRecommendation recommendation() {
        return recommendation;
    }

    public String creditScoreS() {
        return creditScore;
    }
}
