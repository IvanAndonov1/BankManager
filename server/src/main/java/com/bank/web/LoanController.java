package com.bank.web;

import com.bank.dao.LoanApplicationDao;
import com.bank.dto.*;
import com.bank.enums.LoanApplicationStatus;
import com.bank.service.CreditEvaluationService;
import com.bank.service.LoanDecisionService;
import com.bank.service.LoanPricingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import javax.swing.*;
import java.math.BigDecimal;
import java.util.Map;

import static com.bank.security.SecurityUtil.*;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanApplicationDao dao;
    private final CreditEvaluationService evaluator;
    private final LoanDecisionService decisionService;
    private final LoanPricingService pricingService;

    public LoanController(LoanApplicationDao dao,
                          CreditEvaluationService evaluator,
                          LoanDecisionService decisionService,
                          LoanPricingService pricingService) {
        this.dao = dao;
        this.evaluator = evaluator;
        this.decisionService = decisionService;
        this.pricingService = pricingService;

    }

    @PostMapping("/quote")
    public LoanQuoteResponseDto quote(@RequestBody LoanQuoteRequestDto req) {

        if (req.requestedAmount() == null || req.termMonths() == null)
            throw new IllegalArgumentException("Requested amount and term months are required!");

        var pricing = pricingService.calculate(req.requestedAmount(), req.termMonths());

        return new LoanQuoteResponseDto(
                "EUR",
                pricing.annualRate(),
                pricing.monthlyPayment(),
                pricing.totalPayable(),
                req.requestedAmount(),
                req.termMonths()
        );

    }

    @PostMapping("/applications")
    public Map<String, Object> create(@RequestBody CreateLoanRequestDto req) {

        if (req.customerId() == null || req.requestedAmount() == null || req.termMonths() == null ||
                req.currentJobStartDate() == null || req.netSalary() == null) {

            throw new IllegalArgumentException("Missing required fields!");

        }

        if (isCustomer() && !currentUserId().equals(req.customerId())) {
            throw new AccessDeniedException("Forbidden");
        }

        var pricing = pricingService.calculate(req.requestedAmount(), req.termMonths());

        Long id = dao.create(
                req.customerId(),
                req.requestedAmount(),
                req.termMonths(),
                req.currentJobStartDate(),
                req.netSalary()
        );

        dao.updatePricing(id, "EUR", pricing.annualRate(), pricing.monthlyPayment(), pricing.totalPayable());

        return Map.of(
                "id", id,
                "status", "PENDING",
                "currency", "EUR",
                "annualRate", pricing.annualRate(),
                "monthlyPayment", pricing.monthlyPayment(),
                "totalPayable", pricing.totalPayable()
        );

    }


    @GetMapping("/{id}")
    public LoanApplicationDto get(@PathVariable Long id) {

        if (isCustomer()) {

            Long ownerId = dao.findCustomerIdByApplicationId(id);

            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }

        }

        return dao.findById(id);
    }

    @PostMapping("/applications/{id}/decision")
    public Map<String, Object> decide(@PathVariable Long id, @RequestParam Long userId, @RequestParam boolean approve) {

        if (isCustomer()) {
            throw new AccessDeniedException("Forbidden");
        }

        boolean ok = decisionService.decide(id, userId, approve);
        LoanApplicationDto dto = dao.findById(id);
        return Map.of("ok", ok, "status", dto.status().name());

    }

    @PostMapping("/applications/{id}/evaluate")
    public ResponseEntity<EvaluationBreakdown> evaluateApplication(@PathVariable Long id) {

        if (isCustomer()) {

            Long ownerId = dao.findCustomerIdByApplicationId(id);

            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }

        }

        EvaluationBreakdown breakdown = decisionService.evaluateApplication(id);
        return ResponseEntity.ok(breakdown);

    }

}