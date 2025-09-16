package com.bank.dto;

import java.util.List;

/**
 * Result of evaluating a loan application.
 * Sent back to the client when hitting /api/loans/applications/{id}/evaluate
 */
public record EvaluationResult(
        String status,        // APPROVED / DECLINED
        List<String> reasons
) {}
