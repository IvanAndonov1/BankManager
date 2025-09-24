package com.bank.dto;

public record EvaluationWithFeedback(
        EvaluationBreakdown breakdown,
        String feedback
) {}
