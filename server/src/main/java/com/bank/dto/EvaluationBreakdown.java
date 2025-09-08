package com.bank.dto;

import java.util.List;

public record EvaluationBreakdown(
        String status,
        List<String> reasons,
        int tenureScore,       // A
        int dtiScore,          // B
        int incomeScore,       // D
        int accountAgeScore,   // E
        int cushionScore,      // F
        int recentDebtScore,   // H
        int composite
) {}
