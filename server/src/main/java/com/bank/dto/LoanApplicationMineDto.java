package com.bank.dto;

import com.bank.enums.LoanApplicationStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record LoanApplicationMineDto(
        BigDecimal requestedAmount,
        Integer termMonths,
        LoanApplicationStatus status,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        List<String> reasons,
        String currency,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        EvaluationView evaluation
) {
        public record EvaluationView(
                double percentageOfMax,
                int maxPossiblePoints,
                String creditScore,
                Scores scores,
                int accumulatedPoints
        ) {}

        public record Scores(
                int cushion,
                int tenure,
                int dti,
                int recentDebt,
                int accountAge
        ) {}
}
