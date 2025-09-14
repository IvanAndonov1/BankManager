package com.bank.web;

import com.bank.dao.LoanApplicationDao;
import com.bank.dto.*;
import com.bank.enums.LoanApplicationStatus;
import com.bank.service.CreditEvaluationService;
import com.bank.service.LoanDecisionService;
import com.bank.service.LoanPricingService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

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
        if (req.requestedAmount() == null || req.requestedAmount().signum() <= 0)
            throw new IllegalArgumentException("Requested amount must be > 0!");
        if (req.requestedAmount().compareTo(new BigDecimal("100000")) > 0)
            throw new IllegalArgumentException("Max amount is 100000 EUR!");
        if (req.termMonths() == null || req.termMonths() < 12 || req.termMonths() > 240)
            throw new IllegalArgumentException("Term months must be from 12 to 240!");

        var rate  = pricingService.rateForTermMonths(req.termMonths());
        var mp    = pricingService.annuityPayment(req.requestedAmount(), req.termMonths(), rate);
        var total = pricingService.totalPayable(mp, req.termMonths());

        return new LoanQuoteResponseDto("EUR", rate, mp, total, req.requestedAmount(), req.termMonths());
    }

    @PostMapping("/applications")
    public Map<String, Object> create(@RequestBody CreateLoanRequestDto req) {
        if (req.customerId() == null || req.requestedAmount() == null || req.termMonths() == null ||
                req.currentJobStartDate() == null || req.netSalary() == null) {
            throw new IllegalArgumentException("Missing required fields.");
        }
        if (req.requestedAmount().signum() <= 0)
            throw new IllegalArgumentException("Requested amount must be > 0");
        if (req.requestedAmount().compareTo(new BigDecimal("100000")) > 0)
            throw new IllegalArgumentException("Max amount is 100000 EUR");
        if (req.termMonths() < 12 || req.termMonths() > 240)
            throw new IllegalArgumentException("Term months must be from 12 to 240!");

        // Customers can only create for themselves
        if (isCustomer() && !currentUserId().equals(req.customerId())) {
            throw new AccessDeniedException("Forbidden");
        }

        Long id = dao.create(
                req.customerId(),
                req.requestedAmount(),
                req.termMonths(),
                req.currentJobStartDate(),
                req.netSalary()
        );

        var rate  = pricingService.rateForTermMonths(req.termMonths());
        var mp    = pricingService.annuityPayment(req.requestedAmount(), req.termMonths(), rate);
        var total = pricingService.totalPayable(mp, req.termMonths());

        dao.updatePricing(id, "EUR", rate, mp, total);

        return Map.of(
                "id", id,
                "status", "PENDING",
                "currency", "EUR",
                "annualRate", rate,
                "monthlyPayment", mp,
                "totalPayable", total
        );
    }

    @PostMapping("/applications/{id}/evaluate")
    public EvaluationBreakdown evaluate(@PathVariable Long id) {
        // Customers can only evaluate their own application
        if (isCustomer()) {
            Long ownerId = dao.findCustomerIdByApplicationId(id);
            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        return evaluator.evaluate(id);
    }

    @GetMapping("/{id}")
    public LoanApplicationDto get(@PathVariable Long id) {
        // Customers can only read their own application
        if (isCustomer()) {
            Long ownerId = dao.findCustomerIdByApplicationId(id);
            if (ownerId == null || !ownerId.equals(currentUserId())) {
                throw new AccessDeniedException("Forbidden");
            }
        }
        return dao.findById(id);
    }

    @PostMapping("/applications/{id}/decision")
    public Map<String, Object> decide(@PathVariable Long id,
                                      @RequestParam Long userId,
                                      @RequestParam boolean approve) {
        // Customers cannot decide
        if (isCustomer()) {
            throw new AccessDeniedException("Forbidden");
        }

        boolean ok = decisionService.decide(id, userId, approve);
        LoanApplicationDto dto = dao.findById(id);
        return Map.of("ok", ok, "status", dto.status().name());
    }
}
