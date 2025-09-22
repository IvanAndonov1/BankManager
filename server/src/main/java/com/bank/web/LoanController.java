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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
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

    @GetMapping("/quote")
    public LoanQuoteResponseDto quote(@RequestParam BigDecimal requestedAmount,
                                      @RequestParam Integer termMonths) {

        if (requestedAmount == null || termMonths == null)
            throw new IllegalArgumentException("Requested amount and term months are required!");

        var pricing = pricingService.calculate(requestedAmount, termMonths);

        return new LoanQuoteResponseDto(
                "EUR",
                pricing.annualRate(),
                pricing.monthlyPayment(),
                pricing.totalPayable(),
                requestedAmount,
                termMonths
        );

    }

    @PostMapping("/applications")
    public Map<String, Object> create(@RequestBody CreateLoanRequestDto req) {

        if (req.requestedAmount() == null || req.termMonths() == null ||
                req.currentJobStartDate() == null || req.netSalary() == null || req.targetAccountNumber() == null) {

            throw new IllegalArgumentException("Missing required fields!");

        }

        if (!isCustomer()) {
            throw new AccessDeniedException("Only customers can create loan applications!");
        }

        Long customerId = currentUserId();

        Long targetAccountId = dao.findAccountByNumberForCustomer(req.targetAccountNumber(), customerId);

        if(targetAccountId == null){
            throw new IllegalArgumentException("Target account number is invalid or doesn't belong to the customer!");
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

        dao.updateTargetAccount(id, targetAccountId);

        var breakdown = decisionService.evaluateApplication(id);

        Map<String, Object> evaluation = Map.of(
                "accumulatedPoints", breakdown.accumulatedPoints(),
                "maxPossiblePoints", breakdown.maxPossiblePoints(),
                "percentageOfMax", breakdown.percentageOfMax(),
                "creditScore", breakdown.creditScore(),
                "scores", Map.of(
                        "tenure", breakdown.tenureScore(),
                        "dti", breakdown.dtiScore(),
                        "accountAge", breakdown.accountAgeScore(),
                        "cushion", breakdown.cushionScore(),
                        "recentDebt", breakdown.recentDebtScore()
                )
        );

        return Map.of(
                "status", "PENDING",
                "currency", "EUR",
                "annualRate", pricing.annualRate(),
                "monthlyPayment", pricing.monthlyPayment(),
                "totalPayable", pricing.totalPayable(),
                "targetAccountNumber", req.targetAccountNumber(),
                "evaluation", evaluation
        );

    }

    @GetMapping("applications/mine")
    public List<LoanApplicationMineDto> myApplications(){

        if(!isCustomer()){
            throw new AccessDeniedException("Forbidden!");
        }

        Long cid = currentUserId();

        return dao.findMineByCustomer(cid, evaluator::evaluate);

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

    @GetMapping("/applications/{id}/evaluate")
    public ResponseEntity<EvaluationBreakdown> evaluateApplication(@PathVariable Long id) {

        if(!isEmployeeOrAdmin()){
            throw new AccessDeniedException("Forbidden!");
        }

        EvaluationBreakdown breakdown = decisionService.evaluateApplication(id);
        return ResponseEntity.ok(breakdown);

    }

    @GetMapping("/applications")
    public List<Map<String, Object>> listForStaff(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset
    ) {

        if (!isEmployeeOrAdmin()) {
            throw new AccessDeniedException("Forbidden");
        }

        var rows = dao.findForStaffBasics(limit, offset, status, customerId);

        List<Map<String, Object>> out = new ArrayList<>(rows.size());

        for (var r : rows) {

            var eb = evaluator.evaluate(r.id());

            double percentageOfMax = (eb.maxPossiblePoints() > 0)
                    ? eb.accumulatedPoints() * 100.0 / eb.maxPossiblePoints()
                    : 0.0;

            var m = new LinkedHashMap<String, Object>();
            m.put("id", r.id());
            m.put("customerId", r.customerId());
            m.put("requestedAmount", r.requestedAmount());
            m.put("termMonths", r.termMonths());
            m.put("status", r.status().name());
            m.put("currentJobStartDate", r.currentJobStartDate());
            m.put("netSalary", r.netSalary());
            m.put("currency", r.currency());
            m.put("nominalAnnualRate", r.nominalAnnualRate());
            m.put("monthlyPayment", r.monthlyPayment());
            m.put("totalPayable", r.totalPayable());
            m.put("targetAccountNumber", r.targetAccountNumber());
            m.put("decidedByUserId", r.decidedByUserId());
            m.put("decidedAt", r.decidedAt());
            m.put("reasons", r.reasons());

            m.put("tenureScore", eb.tenureScore());
            m.put("dtiScore", eb.dtiScore());
            m.put("accountAgeScore", eb.accountAgeScore());
            m.put("cushionScore", eb.cushionScore());
            m.put("recentDebtScore", eb.recentDebtScore());
            m.put("composite", eb.composite());
            m.put("accumulatedPoints", eb.accumulatedPoints());
            m.put("maxPossiblePoints", eb.maxPossiblePoints());
            m.put("percentageOfMax", percentageOfMax);
            m.put("creditScore", eb.creditScore());
            m.put("recommendation", eb.recommendation().name());

            m.put("disbursedAt", r.disbursedAt());
            m.put("disbursedAmount", r.disbursedAmount());
            m.put("createdAt", r.createdAt());
            m.put("updatedAt", r.updatedAt());

            out.add(m);
        }

        return out;
    }

}