package com.bank.web;

import com.bank.dto.EvaluationBreakdown;
import com.bank.dto.EvaluationWithFeedback;
import com.bank.service.CreditFeedbackAiService;
import com.bank.service.LoanDecisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import static com.bank.security.SecurityUtil.isEmployeeOrAdmin;

@RestController
@RequestMapping("/api/loans/feedback")
public class LoanFeedbackController {

    private final LoanDecisionService decisionService;
    private final CreditFeedbackAiService aiFeedback;

    public LoanFeedbackController(LoanDecisionService decisionService, CreditFeedbackAiService aiFeedback) {
        this.decisionService = decisionService;
        this.aiFeedback = aiFeedback;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluationWithFeedback> getFeedback(@PathVariable Long id) {
        if (!isEmployeeOrAdmin()) {
            throw new AccessDeniedException("Forbidden");
        }

        EvaluationBreakdown breakdown = decisionService.evaluateApplication(id);
        String aiSummary = aiFeedback.generateAiFeedback(breakdown);

        return ResponseEntity.ok(new EvaluationWithFeedback(breakdown, aiSummary));
    }
}
